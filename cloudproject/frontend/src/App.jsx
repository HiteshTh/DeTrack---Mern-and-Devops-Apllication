import { useState, useEffect, useRef } from 'react';
import { PlusCircle, LayoutDashboard, CheckCircle2, List, Sparkles, LogOut, BarChart3, Brain, Shield, GitBranch } from 'lucide-react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ZenMode from './components/ZenMode';
import SprintPlanner from './components/SprintPlanner';
import AuditLogs from './components/AuditLogs';
import LandingPage from './components/LandingPage';
import GitHubSyncView from './components/GitHubSyncView';
import GitHubConnect from './components/GitHubConnect';
import './components/GitHub.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Auth State
  const [authView, setAuthView] = useState('landing'); // 'landing' | 'login'
  const cursorRef = useRef(null);
  const [tasks, setTasks] = useState([
    { _id: '1', taskId: 'DEV-101', title: 'Setup Jenkins Pipeline', description: 'Configure Docker agent and Trivy scan stage.', priority: 'High', status: 'To Do', date: 'Just now' },
    { _id: '2', taskId: 'DEV-102', title: 'Write Kubernetes Manifests', description: 'Create deployment and service yamls for Node and React.', priority: 'High', status: 'In Progress', date: '2h ago' },
    { _id: '3', taskId: 'DEV-103', title: 'Configure LocalStack', description: 'Emulate AWS S3 for file uploads locally.', priority: 'Medium', status: 'Done', date: '1d ago' }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [zenTask, setZenTask] = useState(null);
  const [showGithubConnect, setShowGithubConnect] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Handle Browser Back Button (History API)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (!hash) {
        if (!user) {
          setAuthView('landing');
          window.history.replaceState(null, '', '#landing');
        } else {
          setCurrentView('dashboard');
          window.history.replaceState(null, '', '#dashboard');
        }
        return;
      }
      
      if (!user) {
        if (hash === 'login') {
          setAuthView('login');
        } else {
          setAuthView('landing');
        }
      } else {
        const validViews = ['dashboard', 'all', 'completed', 'sprint', 'analytics', 'security', 'github'];
        if (validViews.includes(hash)) {
          setCurrentView(hash);
        } else {
          setCurrentView('dashboard');
          window.history.replaceState(null, '', '#dashboard');
        }
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Process initial hash
    handlePopState();
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      if (!response.ok) throw new Error('Failed to load tasks');
      const data = await response.json();
      setTasks(data.map(task => ({
        ...task,
        date: task.date || (task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Just now')
      })));
    } catch (err) {
      console.error('Task fetch error:', err);
    }
  };

   
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const changeAuthView = (view) => {
    setAuthView(view);
    window.history.pushState(null, '', `#${view}`);
  };

  const changeView = (view) => {
    setCurrentView(view);
    window.history.pushState(null, '', `#${view}`);
  };



  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cursorRef.current) return;
      
      // Update position without triggering React re-render
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
      
      // Check if hovering over an interactive element
      const target = e.target;
      const isInteractive = target.closest('button, a, input, .task-card, .nav-item, .fancy-btn');
      
      if (isInteractive) {
        cursorRef.current.classList.add('cursor-hover');
      } else {
        cursorRef.current.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    window.history.pushState(null, '', '#dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('devtrack_token');
    setUser(null);
    window.history.pushState(null, '', '#landing');
  };

  const addTask = async (newTask) => {
    try {
      const formData = new FormData();
      formData.append('title', newTask.title);
      formData.append('description', newTask.description);
      formData.append('priority', newTask.priority);
      formData.append('status', newTask.status || 'To Do');

      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to save task');
      const savedTask = await response.json();
      setTasks(prev => [{
        ...savedTask,
        date: savedTask.date || (savedTask.createdAt ? new Date(savedTask.createdAt).toLocaleString() : 'Just now')
      }, ...prev]);
    } catch (err) {
      console.error('Add task error:', err);
      const taskId = `DEV-${Math.floor(1000 + Math.random() * 9000)}`;
      setTasks(prev => [{ ...newTask, _id: Date.now().toString(), taskId, date: 'Just now' }, ...prev]);
    } finally {
      setShowForm(false);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    setTasks(prev => prev.map(task => task._id === id ? { ...task, status: newStatus } : task));
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Update status failed:', err);
    }
  };

  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(task => task._id !== id));
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Delete task failed:', err);
    }
  };

  // We remove the early return so the cursor renders globally

  const renderContent = () => {
    if (currentView === 'all') {
      return (
        <div className="list-view-container fade-in">
          <h2 className="view-title"><List className="inline-icon" /> All Tasks Pipeline</h2>
          <div className="full-list">
            <TaskList 
              title="Everything" 
              tasks={tasks} 
              onUpdateStatus={updateTaskStatus}
              onDelete={deleteTask}
              onOpenZenMode={setZenTask}
              layout="horizontal"
            />
          </div>
        </div>
      );
    }

    if (currentView === 'completed') {
      return (
        <div className="list-view-container fade-in">
          <h2 className="view-title"><CheckCircle2 className="inline-icon" color="#10b981" /> Completed Archive</h2>
          <div className="full-list">
            <TaskList 
              title="Done" 
              tasks={tasks.filter(t => t.status === 'Done')} 
              onUpdateStatus={updateTaskStatus}
              onDelete={deleteTask}
              onOpenZenMode={setZenTask}
              layout="horizontal"
            />
          </div>
        </div>
      );
    }

    if (currentView === 'analytics') {
      return (
        <div className="list-view-container fade-in" style={{ height: 'calc(100vh - 120px)' }}>
          <AnalyticsDashboard tasks={tasks} />
        </div>
      );
    }

    if (currentView === 'sprint') {
      return <SprintPlanner tasks={tasks} />;
    }

    if (currentView === 'security') {
      return <AuditLogs />;
    }

    if (currentView === 'github') {
      return (
        <GitHubSyncView
          tasks={tasks}
          apiUrl={API_URL}
          onTasksMoved={fetchTasks}
          onOpenConnect={() => setShowGithubConnect(true)}
        />
      );
    }


    // Default Dashboard (Kanban style but modernized)
    return (
      <div className="board-container fade-in">
        <TaskList 
          title="To Do" 
          tasks={tasks.filter(t => t.status === 'To Do')} 
          onUpdateStatus={updateTaskStatus}
          onDelete={deleteTask}
          onOpenZenMode={setZenTask}
          accent="purple"
        />
        <TaskList 
          title="In Progress" 
          tasks={tasks.filter(t => t.status === 'In Progress')} 
          onUpdateStatus={updateTaskStatus}
          onDelete={deleteTask}
          onOpenZenMode={setZenTask}
          accent="blue"
        />
        <TaskList 
          title="Done" 
          tasks={tasks.filter(t => t.status === 'Done')} 
          onUpdateStatus={updateTaskStatus}
          onDelete={deleteTask}
          onOpenZenMode={setZenTask}
          accent="green"
        />
      </div>
    );
  };

  return (
    <div className="lusion-theme" style={{ height: '100vh', width: '100vw' }}>
      {/* Lusion Custom Interactive Cursor */}
      <div 
        ref={cursorRef}
        className="custom-cursor"
        style={{ left: '-100px', top: '-100px' }}
      ></div>

      {!user ? (
        authView === 'landing' ? (
          <LandingPage onGetStarted={() => changeAuthView('login')} />
        ) : (
          <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <button 
              onClick={() => changeAuthView('landing')} 
              style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', zIndex: 100 }}
            >
              ← Back to site
            </button>
            <Login onLogin={handleLogin} />
          </div>
        )
      ) : (
        <div className="app-container">
          {/* Minimalist Grid Background (Lusion vibe) */}
          <div className="lusion-grid"></div>

          {/* Dark Animated Waves */}
          <div className="wave-background">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>

          {/* Floating Island Sidebar */}
      <aside className="sidebar floating-panel">
        <div className="logo-container">
          <div className="logo-orb"></div>
          <h1 className="logo-text">DevTrack</h1>
        </div>
        
        <nav className="nav-menu">
          <button 
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => changeView('dashboard')}
          >
            <LayoutDashboard size={20} /> <span className="nav-text">Board</span>
          </button>
          <button 
            className={`nav-item ${currentView === 'all' ? 'active' : ''}`}
            onClick={() => changeView('all')}
          >
            <List size={20} /> <span className="nav-text">Pipeline</span>
            <span className="badge">{tasks.length}</span>
          </button>
          <button 
            className={`nav-item ${currentView === 'completed' ? 'active' : ''}`}
            onClick={() => changeView('completed')}
          >
            <CheckCircle2 size={20} /> <span className="nav-text">Completed</span>
          </button>
          <button 
            className={`nav-item ${currentView === 'sprint' ? 'active' : ''}`}
            onClick={() => changeView('sprint')}
          >
            <Brain size={20} /> <span className="nav-text">AI Planner</span>
          </button>
          <button 
            className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => changeView('analytics')}
          >
            <BarChart3 size={20} /> <span className="nav-text">Analytics</span>
          </button>
          
          <button 
            className={`nav-item ${currentView === 'security' ? 'active' : ''}`}
            onClick={() => changeView('security')}
            style={{ color: currentView === 'security' ? '#ef4444' : '#f87171' }}
          >
            <Shield size={20} /> <span className="nav-text">Security logs</span>
          </button>

          <button
            className={`nav-item ${currentView === 'github' ? 'active' : ''}`}
            onClick={() => changeView('github')}
            style={{ color: currentView === 'github' ? '#818cf8' : '#6366f1' }}
          >
            <GitBranch size={20} /> <span className="nav-text">GitHub Sync</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          {user?.role !== 'Viewer' && (
            <button className="primary-fab" onClick={() => setShowForm(true)} style={{ marginBottom: '15px' }}>
              <PlusCircle size={24} />
              <span>Deploy Task</span>
            </button>
          )}
          <button className="nav-item signout-btn" onClick={handleLogout} style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <LogOut size={20} /> <span className="nav-text">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-titles" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div>
              <h2><Sparkles size={24} className="header-icon" /> Workspace Sync</h2>
              <p className="text-muted">Orchestrating workflows with zero friction.</p>
            </div>
          </div>
          
          <div className="header-right-actions">
            <div className="header-stats floating-panel">
              <div className="stat">
                <span className="stat-val">{tasks.filter(t => t.status === 'Done').length}</span>
                <span className="stat-label">Resolved</span>
              </div>
              <div className="stat divider"></div>
              <div className="stat">
                <span className="stat-val">{tasks.filter(t => t.status === 'In Progress').length}</span>
                <span className="stat-label">Active</span>
              </div>
            </div>
            
            <UserProfile user={user} onLogout={handleLogout} />
          </div>
        </header>

        {renderContent()}

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content floating-panel" onClick={e => e.stopPropagation()}>
              <TaskForm onSubmit={addTask} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        )}
        
        {zenTask && (
          <ZenMode task={zenTask} onClose={() => setZenTask(null)} />
        )}

        {showGithubConnect && (
          <GitHubConnect
            apiUrl={API_URL}
            onClose={() => setShowGithubConnect(false)}
          />
        )}
      </main>
    </div>
    )}
    </div>
  );
}

export default App;
