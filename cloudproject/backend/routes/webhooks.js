const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Task = require('../models/Task');
const GitHubActivity = require('../models/GitHubActivity');

// ──────────────────────────────────────────────
// SSE Client Registry (in-memory)
// Each connected browser tab registers here to
// receive real-time push events.
// ──────────────────────────────────────────────
const sseClients = new Set();

/**
 * Broadcast a JSON payload to all SSE clients.
 */
function broadcast(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try { res.write(msg); } catch (_) { sseClients.delete(res); }
  }
}

// ──────────────────────────────────────────────
// GET /api/webhooks/events  — SSE live stream
// The frontend connects here once; events are
// pushed whenever GitHub fires the webhook.
// ──────────────────────────────────────────────
router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // Send a heartbeat every 25 s to keep the connection alive through proxies
  const heartbeat = setInterval(() => {
    try { res.write(': heartbeat\n\n'); } catch (_) { clearInterval(heartbeat); }
  }, 25000);

  // Send "connected" confirmation
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Live GitHub feed connected ✅' })}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// ──────────────────────────────────────────────
// GET /api/webhooks/activity  — Recent activity
// Returns the last 50 GitHub events from DB.
// ──────────────────────────────────────────────
router.get('/activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const events = await GitHubActivity.find()
      .sort({ receivedAt: -1 })
      .limit(limit);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────────────────
// Helper – verify GitHub HMAC-SHA256 signature
// Set GITHUB_WEBHOOK_SECRET in your .env to
// the same secret you configured on GitHub.
// ──────────────────────────────────────────────
function getRequestBodyString(req) {
  if (req.rawBody && Buffer.isBuffer(req.rawBody)) {
    return req.rawBody.toString('utf8');
  }
  return JSON.stringify(req.body || {});
}

function verifySignature(req) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return true; // Skip verification if no secret configured (dev mode)

  const sigHeader = req.headers['x-hub-signature-256'];
  if (!sigHeader) return false;

  const bodyString = getRequestBodyString(req);
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(bodyString)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(sigHeader), Buffer.from(expected));
}

// ──────────────────────────────────────────────
// Regex patterns – commit message → task status
// Examples:
//   "fixes #DEV-101 login bug"      → Done
//   "starts #DEV-202 new feature"   → In Progress
//   "closes #DEV-303"               → Done
// ──────────────────────────────────────────────
const DONE_RE     = /(?:fixes|closes|resolves|done)\s+#(DEV-\d+)/gi;
const PROGRESS_RE = /(?:starts|working\s+on|progress(?:es)?|wip)\s+#(DEV-\d+)/gi;

async function processCommit(message) {
  const linked = [];

  let match;

  // Reset lastIndex before each exec loop
  DONE_RE.lastIndex = 0;
  while ((match = DONE_RE.exec(message)) !== null) {
    const taskId = match[1].toUpperCase();
    if (!linked.includes(taskId)) {
      linked.push(taskId);
      const updated = await Task.findOneAndUpdate(
        { taskId },
        { status: 'Done' },
        { new: true }
      );
      if (updated) {
        console.log(`[Webhook] ✅ ${taskId} → Done`);
      }
    }
  }

  PROGRESS_RE.lastIndex = 0;
  while ((match = PROGRESS_RE.exec(message)) !== null) {
    const taskId = match[1].toUpperCase();
    if (!linked.includes(taskId)) linked.push(taskId);
    const updated = await Task.findOneAndUpdate(
      { taskId },
      { status: 'In Progress' },
      { new: true }
    );
    if (updated) {
      console.log(`[Webhook] 🔵 ${taskId} → In Progress`);
    }
  }

  // Ensure uniqueness
  return [...new Set(linked)];
}

// ──────────────────────────────────────────────
// POST /api/webhooks/github  — GitHub Webhook
// Configure this URL in your GitHub repo:
//   Settings → Webhooks → Add webhook
//   Payload URL: https://your-server/api/webhooks/github
//   Content type: application/json
//   Events: Pushes (at minimum)
// ──────────────────────────────────────────────
router.post('/github', async (req, res) => {
  // 1. Verify signature
  if (!verifySignature(req)) {
    console.warn('[Webhook] ❌ Invalid signature – rejected');
    return res.status(401).send('Invalid signature');
  }

  const event = req.headers['x-github-event'] || 'push';
  let payload = req.body;
  if (req.rawBody && Buffer.isBuffer(req.rawBody)) {
    try {
      payload = JSON.parse(req.rawBody.toString('utf8'));
    } catch (_) {
      payload = req.body;
    }
  }

  try {
    // ── Handle PUSH events ──────────────────────
    if (event === 'push' && payload.commits && Array.isArray(payload.commits)) {
      const allLinkedTasks = [];
      const processedCommits = [];

      for (const commit of payload.commits) {
        const linked = await processCommit(commit.message);
        allLinkedTasks.push(...linked);
        processedCommits.push({
          sha:       commit.id ? commit.id.substring(0, 7) : '0000000',
          message:   commit.message,
          author:    commit.author?.name || payload.pusher?.name || 'Unknown',
          url:       commit.url,
          timestamp: commit.timestamp ? new Date(commit.timestamp) : new Date()
        });
      }

      const branch = (payload.ref || 'refs/heads/main').replace('refs/heads/', '');

      // Save to DB
      const activity = new GitHubActivity({
        event:       'push',
        repoName:    payload.repository?.full_name || payload.repository?.name || 'unknown/repo',
        repoUrl:     payload.repository?.html_url,
        pusher:      payload.pusher?.name || 'Unknown',
        branch,
        commits:     processedCommits,
        linkedTasks: [...new Set(allLinkedTasks)]
      });
      let saved;
      try {
        saved = await activity.save();
      } catch (saveErr) {
        console.error('[Webhook] DB save failed, continuing without DB:', saveErr.message || saveErr);
        saved = typeof activity.toObject === 'function' ? activity.toObject() : { ...activity };
        saved._id = saved._id || `tmp-${Date.now()}`;
      }

      // Broadcast SSE to all listening frontend tabs (send activity even if DB is offline)
      broadcast({
        type:     'push',
        activity: saved,
        tasksMoved: [...new Set(allLinkedTasks)]
      });

      console.log(`[Webhook] 📦 Push from ${payload.pusher?.name} on ${branch} – ${processedCommits.length} commit(s)`);
    }

    // ── Handle PING (first webhook setup) ───────
    if (event === 'ping') {
      console.log('[Webhook] 🏓 Ping received from GitHub');
      broadcast({ type: 'ping', message: 'GitHub webhook connected!' });
    }

    res.status(200).json({ received: true, event });
  } catch (err) {
    console.error('[Webhook] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────────────────
// POST /api/webhooks/simulate  — Dev Testing
// Lets you fire a fake GitHub push from the UI
// without needing a real public server.
// ──────────────────────────────────────────────
router.post('/simulate', async (req, res) => {
  const { pusher, branch, message = '', taskId } = req.body;

  // If the message already contains a task token like #DEV-123, avoid appending another
  const hasTaskToken = /#?DEV-\d+/i.test(message);
  const fullMessage = (taskId && !hasTaskToken) ? `${message} fixes #${taskId}` : message;
  console.log(`[Webhook][Simulate] message="${message}" taskId="${taskId}" hasTaskToken=${hasTaskToken} fullMessage="${fullMessage.replace(/\"/g,'\\\"')}"`);
  const linked = await processCommit(fullMessage);

  const fakeCommit = {
    sha:       Math.random().toString(16).substring(2, 9),
    message:   fullMessage,
    author:    pusher || 'dev',
    url:       '#',
    timestamp: new Date()
  };

  const activity = new GitHubActivity({
    event:       'push',
    repoName:    'your-org/devtrack',
    repoUrl:     '#',
    pusher:      pusher || 'dev',
    branch:      branch || 'main',
    commits:     [fakeCommit],
    linkedTasks: linked
  });
  let saved;
  try {
    saved = await activity.save();
  } catch (err) {
    console.error('[Webhook][Simulate] DB save failed, continuing without DB:', err.message || err);
    saved = typeof activity.toObject === 'function' ? activity.toObject() : { ...activity };
    saved._id = saved._id || `tmp-${Date.now()}`;
  }

  broadcast({
    type:       'push',
    activity:   saved,
    tasksMoved: linked
  });

  res.json({ ok: true, activity: saved, tasksMoved: linked });
});

// ──────────────────────────────────────────────
// GET /api/webhooks/ngrok-url  — Auto-detect ngrok
// Queries the local ngrok agent API to get the
// current public HTTPS tunnel URL automatically.
// ──────────────────────────────────────────────
router.get('/ngrok-url', async (req, res) => {
  try {
    const http = require('http');
    const data = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:4040/api/tunnels', (r) => {
        let body = '';
        r.on('data', chunk => body += chunk);
        r.on('end', () => resolve(body));
      });
      req.on('error', reject);
      req.setTimeout(2000, () => { req.destroy(); reject(new Error('timeout')); });
    });
    const parsed = JSON.parse(data);
    const tunnel = parsed.tunnels?.find(t => t.proto === 'https');
    if (tunnel) {
      res.json({ url: tunnel.public_url, active: true });
    } else {
      res.json({ url: null, active: false });
    }
  } catch (_) {
    res.json({ url: null, active: false });
  }
});

module.exports = router;

