import { useState } from 'react';
import { GitMerge, Copy, Check, X, ExternalLink, Key, Info } from 'lucide-react';

const GitHubConnect = ({ onClose, apiUrl }) => {
  const [copied, setCopied] = useState(false);
  const [secret, setSecret] = useState(import.meta.env.VITE_WEBHOOK_SECRET || '');
  const [ngrokUrl, setNgrokUrl] = useState('');
  const [step, setStep] = useState(1); // 1: info, 2: setup, 3: done

  const baseHost = ngrokUrl.trim() || apiUrl;
  const webhookUrl = `${baseHost.replace(/\/$/, '')}/api/webhooks/github`;

  const copyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content floating-panel gh-connect-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="gh-connect-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="gh-connect-icon">
              <GitMerge size={22} />
            </div>
            <div>
              <h2 className="gh-connect-title">Connect GitHub Repo</h2>
              <p className="gh-connect-sub">Auto-sync commits → board cards</p>
            </div>
          </div>
          <button className="gh-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Step tabs */}
        <div className="gh-steps">
          {[1, 2, 3].map(n => (
            <button
              key={n}
              className={`gh-step-btn ${step === n ? 'active' : ''} ${step > n ? 'done' : ''}`}
              onClick={() => setStep(n)}
            >
              <span className="gh-step-num">{step > n ? '✓' : n}</span>
              <span className="gh-step-label">
                {n === 1 ? 'How it works' : n === 2 ? 'Setup webhook' : 'Test it'}
              </span>
            </button>
          ))}
        </div>

        {/* Step 1 — How it works */}
        {step === 1 && (
          <div className="gh-step-content fade-in">
            <div className="gh-info-grid">
              {[
                {
                  icon: '📝',
                  title: 'Write smart commits',
                  desc: 'Include task IDs in your git commit messages using keywords.',
                  example: 'git commit -m "fixes #DEV-101 fixed auth bug"'
                },
                {
                  icon: '🔗',
                  title: 'GitHub fires webhook',
                  desc: 'GitHub sends a POST request to your DevTrack server on every push.',
                  example: 'POST /api/webhooks/github'
                },
                {
                  icon: '⚡',
                  title: 'Board updates live',
                  desc: 'Your board cards move columns automatically in real time.',
                  example: 'DEV-101 → Done  |  DEV-202 → In Progress'
                }
              ].map((item, i) => (
                <div key={i} className="gh-info-card">
                  <div className="gh-info-emoji">{item.icon}</div>
                  <h4 className="gh-info-title">{item.title}</h4>
                  <p className="gh-info-desc">{item.desc}</p>
                  <code className="gh-code-example">{item.example}</code>
                </div>
              ))}
            </div>

            <div className="gh-keyword-table">
              <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, color: '#64748b', marginBottom: 12 }}>
                Supported keywords
              </h4>
              <div className="gh-kw-grid">
                <div>
                  <span className="gh-kw-label">→ In Progress</span>
                  <div className="gh-kw-tags">
                    {['starts', 'working on', 'wip', 'progresses'].map(k => (
                      <code key={k} className="gh-kw-chip blue">{k}</code>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="gh-kw-label">→ Done</span>
                  <div className="gh-kw-tags">
                    {['fixes', 'closes', 'resolves', 'done'].map(k => (
                      <code key={k} className="gh-kw-chip green">{k}</code>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button className="gh-next-btn" onClick={() => setStep(2)}>
              Set up webhook →
            </button>
          </div>
        )}

        {/* Step 2 — Setup */}
        {step === 2 && (
          <div className="gh-step-content fade-in">
            <ol className="gh-setup-steps">
              <li className="gh-setup-step">
                <div className="gh-setup-num">1</div>
                <div>
                  <p className="gh-setup-title">Open your GitHub repository</p>
                  <p className="gh-setup-desc">
                    Go to <strong>Settings → Webhooks → Add webhook</strong>
                  </p>
                  <a
                    className="gh-link"
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={12} /> github.com
                  </a>
                </div>
              </li>

              <li className="gh-setup-step">
                <div className="gh-setup-num">2</div>
                <div style={{ width: '100%' }}>
                  <p className="gh-setup-title">Configure your Payload URL</p>
                  <p className="gh-setup-desc" style={{ marginBottom: 8 }}>
                    If you are running locally, paste your ngrok forwarding URL here first:
                  </p>
                  <input
                    type="text"
                    placeholder="https://abcdef123.ngrok-free.app"
                    className="gh-secret-input glass-input"
                    style={{ marginBottom: 12, marginTop: 0 }}
                    value={ngrokUrl}
                    onChange={e => setNgrokUrl(e.target.value)}
                  />
                  <div className="gh-copy-row" style={{ marginTop: 0 }}>
                    <code className="gh-url-code">{webhookUrl}</code>
                    <button className="gh-copy-btn" onClick={copyUrl}>
                      {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>
                  <p className="gh-setup-desc" style={{ marginTop: 8 }}>
                    Set <strong>Content type</strong> to <code>application/json</code>
                  </p>
                </div>
              </li>

              <li className="gh-setup-step">
                <div className="gh-setup-num">3</div>
                <div style={{ width: '100%' }}>
                  <p className="gh-setup-title">
                    <Key size={13} style={{ display: 'inline', marginRight: 4 }} />
                    Optional: Add a secret (recommended)
                  </p>
                  <input
                    type="text"
                    placeholder="e.g. my_super_secret_123"
                    className="gh-secret-input glass-input"
                    value={secret}
                    onChange={e => setSecret(e.target.value)}
                  />
                  <p className="gh-setup-desc" style={{ marginTop: 8 }}>
                    Set <code>GITHUB_WEBHOOK_SECRET</code> in your backend <code>.env</code> to the same value.
                  </p>
                </div>
              </li>

              <li className="gh-setup-step">
                <div className="gh-setup-num">4</div>
                <div>
                  <p className="gh-setup-title">Select events</p>
                  <p className="gh-setup-desc">
                    Choose <strong>"Just the push event"</strong> (minimum required). You can also add Pull requests and Issues.
                  </p>
                </div>
              </li>
            </ol>

            <button className="gh-next-btn" onClick={() => setStep(3)}>
              Test the connection →
            </button>
          </div>
        )}

        {/* Step 3 — Test */}
        {step === 3 && (
          <div className="gh-step-content fade-in">
            <div className="gh-done-hero">
              <div className="gh-done-icon">🎉</div>
              <h3 className="gh-done-title">Webhook Configured!</h3>
              <p className="gh-done-sub">
                Use the <strong>Simulator</strong> panel on the board to fire a test push — no real GitHub needed.
                Or push a commit with a task ID and watch your board update live.
              </p>
            </div>

            <div className="gh-test-examples">
              <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, color: '#64748b', marginBottom: 12 }}>
                Try these commit messages
              </h4>
              {[
                'git commit -m "fixes #DEV-101 resolved login issue"',
                'git commit -m "starts #DEV-102 implementing K8s manifests"',
                'git commit -m "closes #DEV-103 and resolves #DEV-101"',
              ].map((cmd, i) => (
                <div key={i} className="gh-example-cmd">
                  <code>{cmd}</code>
                  <button
                    className="gh-copy-btn"
                    onClick={() => navigator.clipboard.writeText(cmd)}
                  >
                    <Copy size={11} />
                  </button>
                </div>
              ))}
            </div>

            <div className="gh-info-banner">
              <Info size={14} />
              <span>
                <strong>Local dev?</strong> GitHub can't reach localhost. Use a tunnel like{' '}
                <a className="gh-link" href="https://ngrok.com" target="_blank" rel="noreferrer">ngrok</a>{' '}
                to expose your backend, or use the built-in Simulator below the board.
              </span>
            </div>

            <button className="gh-next-btn" onClick={onClose} style={{ background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }}>
              ✓ Done — close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubConnect;
