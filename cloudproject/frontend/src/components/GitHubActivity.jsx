import { useEffect, useRef, useState } from 'react';
import { GitCommit, GitBranch, GitMerge, Zap, ExternalLink, Hash, ChevronDown, ChevronUp, Clock } from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)  return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444'
];
function avatarColor(name = '') {
  let h = 0;
  for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

// ─── Single commit row ────────────────────────────────────────
function CommitRow({ commit, linkedTasks }) {
  const linkedInThisCommit = (linkedTasks || []).filter(t =>
    commit.message?.toLowerCase().includes(t.toLowerCase())
  );

  return (
    <div className="gh-commit-row">
      <GitCommit size={13} style={{ color: '#94a3b8', flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="gh-commit-msg">{commit.message}</p>
        <div className="gh-commit-meta">
          <span className="gh-sha">{commit.sha}</span>
          <span style={{ color: '#475569' }}>by {commit.author}</span>
          {commit.timestamp && (
            <span style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} /> {timeAgo(commit.timestamp)}
            </span>
          )}
        </div>
        {linkedInThisCommit.length > 0 && (
          <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {linkedInThisCommit.map(t => (
              <span key={t} className="gh-task-chip">
                <Hash size={9} /> {t}
              </span>
            ))}
          </div>
        )}
      </div>
      {commit.url && commit.url !== '#' && (
        <a href={commit.url} target="_blank" rel="noreferrer" className="gh-ext-link">
          <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
}

// ─── Single push event card ───────────────────────────────────
function ActivityCard({ activity, isNew }) {
  const [expanded, setExpanded] = useState(false);
  const hasMultiple = activity.commits?.length > 1;

  return (
    <div className={`gh-event-card ${isNew ? 'gh-event-card--new' : ''}`}>
      {/* Header */}
      <div className="gh-event-header">
        <div
          className="gh-avatar"
          style={{ background: avatarColor(activity.pusher) }}
        >
          {getInitials(activity.pusher)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="gh-event-title">
            <span className="gh-pusher">{activity.pusher}</span>
            <span style={{ color: '#475569' }}> pushed to </span>
            <span className="gh-branch">
              <GitBranch size={11} style={{ marginRight: 3, display: 'inline' }} />
              {activity.branch}
            </span>
          </div>
          <div className="gh-event-sub">
            <span style={{ color: '#475569' }}>{activity.repoName}</span>
            <span className="gh-time">{timeAgo(activity.receivedAt)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {activity.linkedTasks?.length > 0 && (
            <div style={{ display: 'flex', gap: 4 }}>
              {activity.linkedTasks.map(t => (
                <span key={t} className="gh-task-chip gh-task-chip--accent">
                  <Hash size={9} /> {t}
                </span>
              ))}
            </div>
          )}
          {hasMultiple && (
            <button
              className="gh-expand-btn"
              onClick={() => setExpanded(e => !e)}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Commits */}
      <div className="gh-commits-list">
        {(hasMultiple && !expanded
          ? [activity.commits[0]]
          : activity.commits
        ).map((c, i) => (
          <CommitRow key={i} commit={c} linkedTasks={activity.linkedTasks} />
        ))}
        {hasMultiple && !expanded && activity.commits.length > 1 && (
          <button
            className="gh-show-more"
            onClick={() => setExpanded(true)}
          >
            + {activity.commits.length - 1} more commit{activity.commits.length > 2 ? 's' : ''}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main GitHubActivity panel ────────────────────────────────
const GitHubActivity = ({ apiUrl, onTasksMoved }) => {
  const [activities, setActivities] = useState([]);
  const [connected, setConnected] = useState(false);
  const [newIds, setNewIds] = useState(new Set());
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);
  const feedRef = useRef(null);

  // ── Fetch historical activity on mount ─────
  useEffect(() => {
    fetch(`${apiUrl}/api/webhooks/activity`)
      .then(r => r.json())
      .then(data => setActivities(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [apiUrl]);

  // ── Open SSE connection for live updates ───
  useEffect(() => {
    const es = new EventSource(`${apiUrl}/api/webhooks/events`);
    eventSourceRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => {
      setConnected(false);
      setError('Live feed disconnected — retrying…');
    };

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        if (data.type === 'connected') {
          setConnected(true);
          setError(null);
        }

        if (data.type === 'push' && data.activity) {
          setActivities(prev => [data.activity, ...prev]);
          setNewIds(prev => new Set([...prev, data.activity._id]));

          // Flash "new" highlight for 4s
          setTimeout(() => {
            setNewIds(prev => {
              const n = new Set(prev);
              n.delete(data.activity._id);
              return n;
            });
          }, 4000);

          // Scroll feed to top
          if (feedRef.current) feedRef.current.scrollTop = 0;

          // Notify parent so board cards move
          if (data.tasksMoved?.length > 0 && onTasksMoved) {
            onTasksMoved(data.tasksMoved);
          }
        }
      } catch (error) {
        console.debug('GitHub SSE parse failure', error);
      }
    };

    return () => es.close();
  }, [apiUrl, onTasksMoved]);

  return (
    <div className="gh-panel">
      {/* Panel header */}
      <div className="gh-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GitMerge size={18} style={{ color: '#e2e8f0' }} />
          <span className="gh-panel-title">GitHub Activity</span>
          <span className={`gh-live-dot ${connected ? 'gh-live-dot--on' : 'gh-live-dot--off'}`} />
          <span className="gh-live-label">{connected ? 'LIVE' : 'OFF'}</span>
        </div>
        <span className="gh-count">{activities.length} events</span>
      </div>

      {error && (
        <div className="gh-error-banner">
          <Zap size={12} /> {error}
        </div>
      )}

      {/* Feed */}
      <div className="gh-feed" ref={feedRef}>
        {activities.length === 0 ? (
          <div className="gh-empty">
            <GitMerge size={32} style={{ color: '#334155', marginBottom: 12 }} />
            <p style={{ color: '#475569', fontSize: 13 }}>No pushes yet.</p>
            <p style={{ color: '#334155', fontSize: 12, marginTop: 4 }}>
              Connect your GitHub repo or use the simulator below.
            </p>
          </div>
        ) : (
          activities.map((a, i) => (
            <ActivityCard key={a._id || i} activity={a} isNew={newIds.has(a._id)} />
          ))
        )}
      </div>
    </div>
  );
};

export default GitHubActivity;
