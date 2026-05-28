import { useEffect } from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  useEffect(() => {
    // Add a specific class to body to apply global styles only for landing page
    document.body.classList.add('landing-body');
    return () => {
      document.body.classList.remove('landing-body');
    };
  }, []);

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page-container">
      {/* NAV */}
      <nav className="landing-nav">
        <a href="#" className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M2 4h5v5H2zM9 4h5v3H9zM9 9h5v3H9zM2 11h5v2H2z" fill="#000"/>
            </svg>
          </div>
          DevTrack
        </a>
        <ul className="nav-links">
          <li><a href="#features" onClick={(e) => handleScroll(e, 'features')}>Features</a></li>
          <li><a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')}>How it works</a></li>
          <li><a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')}>Pricing</a></li>
          <li><a href="#integrations" onClick={(e) => handleScroll(e, 'integrations')}>Integrations</a></li>
        </ul>
        <div className="nav-cta">
          <button onClick={onGetStarted} className="btn-ghost">Sign in</button>
          <button onClick={onGetStarted} className="btn-primary">Get started free</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="grid-bg"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>

        <div className="badge">
          <div className="badge-dot"></div>
          Now with AI-powered sprint planning
        </div>

        <h1>
          Ship <span className="accent">faster.</span><br/>
          Track <span className="accent2">smarter.</span><br/>
          Build together.
        </h1>

        <p className="hero-sub">
          DevTrack is the all-in-one project management platform built for developer teams — combining bug tracking, sprint planning, and real-time collaboration in one seamless workflow.
        </p>

        <div className="hero-actions">
          <button onClick={onGetStarted} className="btn-primary btn-large">Start for free →</button>
          <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="btn-outline btn-large">See all features</a>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num">50K+</div>
            <div className="stat-label">Active developers</div>
          </div>
          <div class="stat-item">
            <div className="stat-num">2.4M</div>
            <div className="stat-label">Tasks completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">99.9%</div>
            <div className="stat-label">Uptime SLA</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">4.9★</div>
            <div className="stat-label">Average rating</div>
          </div>
        </div>

        {/* DASHBOARD MOCKUP */}
        <div className="dashboard-preview">
          <div className="preview-bar">
            <div className="preview-dots">
              <div className="dot dot-r"></div>
              <div className="dot dot-y"></div>
              <div className="dot dot-g"></div>
            </div>
            <div className="preview-url">app.devtrack.io/dashboard/projects/alpha-v2</div>
          </div>
          <div className="preview-body">
            <div className="preview-sidebar">
              <div className="sidebar-logo">
                <div className="sidebar-logo-icon"></div>
                DevTrack
              </div>
              <div className="sidebar-section">
                <div className="sidebar-label">Main</div>
                <div className="sidebar-item active">
                  <svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
                  Dashboard
                </div>
                <div className="sidebar-item">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12v2H2zm0 4h8v2H2zm0 4h10v2H2z"/></svg>
                  Projects
                </div>
                <div className="sidebar-item">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a5 5 0 110 10A5 5 0 018 3zm-.5 2v4l3 1.5.5-1-2.5-1.3V5H7.5z"/></svg>
                  Sprints
                </div>
                <div className="sidebar-item">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 11l4-4 3 3 4-5 3 3V14H1z"/></svg>
                  Analytics
                </div>
              </div>
              <div className="sidebar-section">
                <div className="sidebar-label">Team</div>
                <div className="sidebar-item">
                  <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="6" cy="5" r="3"/><path d="M0 14c0-3.3 2.7-6 6-6s6 2.7 6 6H0z"/><circle cx="12" cy="5" r="2"/><path d="M10.5 9a4 4 0 015.5 3.7V14H12v-.3A4 4 0 0010.5 9z"/></svg>
                  Members
                </div>
                <div className="sidebar-item">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.5 4.5H15l-4 3 1.5 4.5L8 10.5 3.5 13 5 8.5l-4-3h5.5z"/></svg>
                  Milestones
                </div>
              </div>
            </div>
            <div className="preview-main">
              <div className="preview-header">
                <div className="preview-title">Alpha v2 — Sprint 14</div>
                <button className="mini-btn">+ Add task</button>
              </div>
              <div className="kanban-cols">
                <div className="kanban-col">
                  <div className="col-head">
                    <span className="col-title">To Do</span>
                    <span className="col-count">4</span>
                  </div>
                  <div className="task-card">
                    <div className="task-title">Fix login redirect on mobile</div>
                    <div className="task-meta">
                      <span className="task-tag tag-bug">BUG</span>
                      <div className="task-avatar av1">AR</div>
                    </div>
                  </div>
                  <div className="task-card">
                    <div className="task-title">Add dark mode toggle</div>
                    <div className="task-meta">
                      <span className="task-tag tag-ui">UI</span>
                      <div className="task-avatar av2">KS</div>
                    </div>
                  </div>
                </div>
                <div className="kanban-col">
                  <div className="col-head">
                    <span className="col-title">In Progress</span>
                    <span className="col-count">3</span>
                  </div>
                  <div className="task-card">
                    <div className="task-title">REST API rate limiting</div>
                    <div className="task-meta">
                      <span className="task-tag tag-api">API</span>
                      <div className="task-avatar av3">PJ</div>
                    </div>
                  </div>
                  <div className="task-card">
                    <div className="task-title">Dashboard analytics widget</div>
                    <div className="task-meta">
                      <span className="task-tag tag-feat">FEAT</span>
                      <div className="task-avatar av4">MR</div>
                    </div>
                  </div>
                </div>
                <div className="kanban-col">
                  <div className="col-head">
                    <span className="col-title">Done</span>
                    <span className="col-count">9</span>
                  </div>
                  <div className="task-card">
                    <div className="task-title">OAuth2 GitHub integration</div>
                    <div className="task-meta">
                      <span className="task-tag tag-feat">FEAT</span>
                      <div className="task-avatar av1">AR</div>
                    </div>
                  </div>
                  <div className="task-card">
                    <div className="task-title">Fix memory leak in socket</div>
                    <div className="task-meta">
                      <span className="task-tag tag-bug">BUG</span>
                      <div className="task-avatar av2">KS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* FEATURES */}
      <section id="features" className="landing-section">
        <div className="section-label">Features</div>
        <h2 className="section-title">Everything your dev team<br/>actually needs</h2>
        <p className="section-sub">From bug tracking to sprint retrospectives, DevTrack has the tools to keep your team moving without the bloat of traditional project management software.</p>

        <div className="features-grid">
          <div className="feature-card wide">
            <div className="feature-icon icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <div className="feature-title">Kanban & Sprint Boards</div>
            <div className="feature-desc">
              Visualize your entire workflow with drag-and-drop Kanban boards. Create custom columns like "To Do", "In Progress", "In Review", and "Done" to match exactly how your team works. Switch to Sprint view for time-boxed iterations with velocity tracking, burndown charts, and retrospective reports built right in.
            </div>
            <div className="feature-tags">
              <span className="f-tag">Drag & Drop</span>
              <span className="f-tag">Custom Columns</span>
              <span className="f-tag">Burndown Charts</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            </div>
            <div className="feature-title">Intelligent Bug Tracking</div>
            <div class="feature-desc">
              Log, triage, and resolve bugs with precision. Attach screenshots, stack traces, and repro steps directly to issues. Branching task history lets you see exactly how bugs evolved from report to fix.
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div className="feature-title">Real-Time Collaboration</div>
            <div className="feature-desc">
              Your entire team sees updates instantly — no refresh needed. Comment threads, @mentions, and task reactions keep conversations in context. Presence indicators show who's viewing what.
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon icon-teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="feature-title">Role-Based Access Control</div>
            <div className="feature-desc">
              Fine-grained permissions for every team member. Set roles at the organization, project, or individual task level. Viewer, contributor, developer, and admin roles keep sensitive project data secure without limiting collaboration.
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>
            </div>
            <div className="feature-title">AI-Powered Sprint Planning</div>
            <div className="feature-desc">
              Let AI analyze your backlog, team capacity, and historical velocity to suggest optimal sprint compositions. Get instant effort estimates, risk flags, and recommended task ordering.
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="landing-section">
        <div className="section-label">How it works</div>
        <h2 className="section-title">Up and running<br/>in minutes</h2>
        <p className="section-sub">No complex setup. No lengthy onboarding. Your team goes from signup to first sprint in under 10 minutes.</p>

        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <div className="step-title">Create workspace</div>
            <div className="step-desc">Sign up, name your organization, and invite your team. Roles are auto-assigned.</div>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <div className="step-title">Set up project</div>
            <div className="step-desc">Create a project from scratch or import from Jira, GitHub Issues in one click.</div>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <div className="step-title">Build backlog</div>
            <div className="step-desc">Add tasks, bugs, and feature requests. Tag them by type, priority, and component.</div>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <div className="step-title">Launch sprint</div>
            <div className="step-desc">Select backlog items, set a sprint goal, assign tasks, and kick off immediately.</div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="landing-section">
        <div className="section-label">Pricing</div>
        <h2 className="section-title">Simple, transparent<br/>pricing</h2>
        
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="plan-name">Starter</div>
            <div className="plan-price">$0 <span>/ mo</span></div>
            <div className="plan-period">Free forever · up to 3 members</div>
            <div className="plan-divider"></div>
            <div className="plan-feature"><svg className="plan-check check-green" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 3.5l-7 7-3-3L2 9l4.5 4.5 8.5-8.5z"/></svg>3 active projects</div>
            <div className="plan-feature"><svg className="plan-check check-green" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 3.5l-7 7-3-3L2 9l4.5 4.5 8.5-8.5z"/></svg>Kanban & backlog</div>
            <button onClick={onGetStarted} className="plan-btn plan-btn-outline">Get started free</button>
          </div>

          <div className="pricing-card featured">
            <div className="popular-badge">Most popular</div>
            <div className="plan-name">Pro</div>
            <div className="plan-price">$18 <span>/ seat/mo</span></div>
            <div className="plan-period">Billed annually · unlimited projects</div>
            <div className="plan-divider"></div>
            <div className="plan-feature"><svg className="plan-check check-green" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 3.5l-7 7-3-3L2 9l4.5 4.5 8.5-8.5z"/></svg>Unlimited projects & members</div>
            <div className="plan-feature"><svg className="plan-check check-green" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 3.5l-7 7-3-3L2 9l4.5 4.5 8.5-8.5z"/></svg>AI sprint planning</div>
            <div className="plan-feature"><svg className="plan-check check-green" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 3.5l-7 7-3-3L2 9l4.5 4.5 8.5-8.5z"/></svg>Advanced analytics & reports</div>
            <div className="plan-feature"><svg className="plan-check check-green" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 3.5l-7 7-3-3L2 9l4.5 4.5 8.5-8.5z"/></svg>All integrations</div>
            <button onClick={onGetStarted} className="plan-btn plan-btn-filled">Start Pro trial</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-bg"></div>
        <div className="section-label">Get started</div>
        <h2 className="section-title">Ready to ship<br/>your best work?</h2>
        <div className="hero-actions">
          <button onClick={onGetStarted} className="btn-primary btn-large">Create free account →</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo" style={{ fontSize: '18px' }}>
              <div className="logo-icon">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h5v5H2zM9 4h5v3H9zM9 9h5v3H9zM2 11h5v2H2z" fill="#000"/>
                </svg>
              </div>
              DevTrack
            </a>
            <p>The developer-first project management tool. Built for teams that ship.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 DevTrack, Inc. All rights reserved.</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>v2.14.0 · Made for developers</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
