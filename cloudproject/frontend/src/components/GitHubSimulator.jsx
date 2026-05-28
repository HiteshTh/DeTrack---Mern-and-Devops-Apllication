import { useState, useRef, useEffect } from 'react';
import { Terminal, Play, Loader, ChevronRight } from 'lucide-react';

const PRESETS = [
  { label: 'Fix a task (→ Done)',         cmd: 'git commit -m "fixes #DEV-101 resolved login bug"' },
  { label: 'Start a task (→ In Progress)', cmd: 'git commit -m "starts #DEV-102 kubernetes manifests"' },
  { label: 'Multi-task commit',            cmd: 'git commit -m "closes #DEV-103 and starts #DEV-104"' },
  { label: 'Plain push (no task link)',    cmd: 'git commit -m "chore: update README"' },
];

function parseFakeCommit(cmdStr) {
  // Extract message from git commit -m "..."
  const match = cmdStr.match(/-m\s+"([^"]+)"/);
  return match ? match[1] : cmdStr;
}

const GitHubSimulator = ({ apiUrl, tasks = [], onTasksMoved }) => {
  const [logs, setLogs] = useState([
    { type: 'system', text: '▸ DevTrack Git Simulator ready.' },
    { type: 'system', text: '▸ Type a git commit command or pick a preset.' },
  ]);
  const [input, setInput] = useState('');
  const [pusher, setPusher] = useState('dev');
  const [branch, setBranch] = useState('main');
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (type, text) =>
    setLogs(prev => [...prev, { type, text }]);

  const runPreset = (cmd) => {
    setInput(cmd);
  };

  const handleRun = async () => {
    const cmd = input.trim();
    if (!cmd || loading) return;

    const message = parseFakeCommit(cmd);

    addLog('cmd',    `$ ${cmd}`);
    addLog('system', `[git] Committing as ${pusher} on ${branch}…`);
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/webhooks/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pusher,
          branch,
          message,
          taskId: selectedTask || undefined,
        }),
      });
      const data = await res.json();

      addLog('success', `[webhook] ✅ Push event sent!`);
      addLog('system',  `[repo]    ${data.activity?.repoName || 'your-org/devtrack'} → ${branch}`);

      if (data.tasksMoved?.length > 0) {
        for (const t of data.tasksMoved) {
          addLog('task', `[board]   📋 ${t} status updated on your board`);
        }
        if (onTasksMoved) onTasksMoved(data.tasksMoved);
      } else {
        addLog('info', '[board]   No task IDs found in commit — board unchanged');
      }
      addLog('success', '[done]    ─────────────────────────────────');
      setInput('');
      setSelectedTask('');
    } catch (err) {
      addLog('error', `[error]   ❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRun();
    }
  };

  return (
    <div className="sim-panel">
      {/* Header */}
      <div className="sim-header">
        <Terminal size={16} style={{ color: '#10b981' }} />
        <span className="sim-title">Git Push Simulator</span>
        <span className="sim-badge">LOCAL DEV</span>
      </div>

      {/* Config row */}
      <div className="sim-config-row">
        <div className="sim-config-item">
          <label className="sim-config-label">PUSHER</label>
          <input
            className="sim-config-input"
            value={pusher}
            onChange={e => setPusher(e.target.value)}
            placeholder="username"
          />
        </div>
        <div className="sim-config-item">
          <label className="sim-config-label">BRANCH</label>
          <input
            className="sim-config-input"
            value={branch}
            onChange={e => setBranch(e.target.value)}
            placeholder="main"
          />
        </div>
        <div className="sim-config-item" style={{ flex: 2 }}>
          <label className="sim-config-label">LINK TASK (optional)</label>
          <select
            className="sim-config-input sim-select"
            value={selectedTask}
            onChange={e => setSelectedTask(e.target.value)}
          >
            <option value="">-- no task link --</option>
            {tasks.map(t => (
              <option key={t._id} value={t.taskId}>
                {t.taskId} — {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Presets */}
      <div className="sim-presets">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            className="sim-preset-btn"
            onClick={() => runPreset(p.cmd)}
            title={p.cmd}
          >
            <ChevronRight size={11} />
            {p.label}
          </button>
        ))}
      </div>

      {/* Terminal output */}
      <div className="sim-terminal">
        {logs.map((l, i) => (
          <div key={i} className={`sim-log sim-log--${l.type}`}>
            {l.text}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Input row */}
      <div className="sim-input-row">
        <span className="sim-prompt">$</span>
        <input
          className="sim-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder='git commit -m "fixes #DEV-101 your message"'
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          className="sim-run-btn"
          onClick={handleRun}
          disabled={loading || !input.trim()}
        >
          {loading ? <Loader size={14} className="sim-spin" /> : <Play size={14} />}
          {loading ? 'Sending…' : 'Run'}
        </button>
      </div>
    </div>
  );
};

export default GitHubSimulator;
