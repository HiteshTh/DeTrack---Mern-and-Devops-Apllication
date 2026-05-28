import { GitBranch, Link } from 'lucide-react';
import GitHubActivity from './GitHubActivity';
import GitHubSimulator from './GitHubSimulator';
import './GitHub.css';

const GitHubSyncView = ({ tasks, apiUrl, onTasksMoved, onOpenConnect }) => {
  return (
    <div className="list-view-container fade-in" style={{ padding: '0 20px' }}>
      <div className="github-view">
        
        {/* Left column: Info & Stats & CTA */}
        <div className="gh-view-left">
          <div>
            <h2 className="gh-view-title">
              <GitBranch size={32} style={{ color: '#818cf8' }} />
              GitHub Sync
            </h2>
            <p className="gh-view-subtitle">Monitor webhook pushes and trigger automatic board updates</p>
          </div>

          <div className="gh-stats-row">
            <div className="gh-stat-card">
              <div className="gh-stat-val">{tasks.filter(t => t.status === 'Done').length}</div>
              <div className="gh-stat-label">Tasks Done</div>
            </div>
            <div className="gh-stat-card">
              <div className="gh-stat-val">{tasks.filter(t => t.status === 'In Progress').length}</div>
              <div className="gh-stat-label">In Progress</div>
            </div>
            <div className="gh-stat-card">
              <div className="gh-stat-val">{tasks.length}</div>
              <div className="gh-stat-label">Total Pipeline</div>
            </div>
          </div>

          <div className="gh-connect-cta">
            <div className="gh-cta-text">
              <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: 8, fontSize: 16 }}>Connect your repository</strong>
              Link your GitHub repo via Webhooks to automatically move tasks on your board when developers push code. Mention task IDs (e.g. #DEV-101) in your commit messages.
            </div>
            <button className="gh-cta-btn" onClick={onOpenConnect}>
              <Link size={16} /> Setup Webhook
            </button>
          </div>
        </div>

        {/* Right column: Activity panel */}
        <GitHubActivity apiUrl={apiUrl} onTasksMoved={onTasksMoved} />

        {/* Bottom row: Simulator */}
        <GitHubSimulator tasks={tasks} apiUrl={apiUrl} onTasksMoved={onTasksMoved} />
        
      </div>
    </div>
  );
};

export default GitHubSyncView;
