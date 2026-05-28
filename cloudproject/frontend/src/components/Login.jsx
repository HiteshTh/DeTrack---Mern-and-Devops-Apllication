import { useState, useEffect } from 'react';
import { Activity, Lock, User, AlertCircle, Eye, EyeOff, ArrowRight, Loader2, Sparkles, Shield } from 'lucide-react';
import './Login.css'; // Import the newly created advanced styles

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Developer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Trigger shake effect when error occurs
   
  useEffect(() => {
    if (error && !error.includes('successful')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShake(true);
      const timer = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isRegistering ? { username, password, role } : { username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      if (isRegistering) {
        // Automatically switch to login after successful registration
        setIsRegistering(false);
        setPassword('');
        setError('Registration successful! Please log in with your new credentials.');
      } else {
        // Successful login
        const enhancedUser = { ...data.user };
        
        localStorage.setItem('devtrack_token', data.token);
        onLogin(enhancedUser);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setUsername('');
    setPassword('');
    setRole('Developer');
  };

  return (
    <div className="login-wrapper">
      {/* Dynamic Animated Visual Side */}
      <div className="login-visuals">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        
        <div className="visual-content">
          <h1>DevTrack</h1>
          <p>Elevate your DevOps workflow. Seamlessly track tasks, manage deployments, and collaborate in a unified, dynamic environment tailored for high-performance teams.</p>
        </div>
      </div>

      {/* Glassmorphic Form Side */}
      <div className="login-form-container">
        <div className={`modern-login-box ${shake ? 'shake' : ''}`}>
          <div className="brand-header">
            <div className="icon-wrapper">
              <Activity size={32} strokeWidth={2.5} />
            </div>
            <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
            <p>{isRegistering ? 'Join the next generation of DevOps.' : 'Enter your credentials to access the portal.'}</p>
          </div>

          {error && (
            <div className={`fancy-alert ${error.includes('successful') ? 'success' : 'error'}`}>
              {error.includes('successful') ? <Sparkles size={18} /> : <AlertCircle size={18} />}
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">


            <div className="floating-input-group">
              <User size={20} className="input-icon-left" />
              <input 
                type="text" 
                id="username"
                className="floating-input" 
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="off"
              />
              <label htmlFor="username" className="floating-label">Username</label>
            </div>

            {isRegistering && (
              <div className="floating-input-group">
                <Shield size={20} className="input-icon-left" />
                <select
                  id="role"
                  className="floating-input"
                  style={{ cursor: 'pointer', appearance: 'none' }}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Developer">Developer</option>
                  <option value="Admin">Admin</option>
                </select>
                <label htmlFor="role" className="floating-label" style={{ transform: 'translateY(-120%) scale(0.85)', color: '#8b5cf6' }}>Select Role</label>
              </div>
            )}

            <div className="floating-input-group">
              <Lock size={20} className="input-icon-left" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password"
                className="floating-input" 
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="password" className="floating-label">Password</label>
              
              <button 
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" className="fancy-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={20} className="loader-spinner" />
                  Processing...
                </>
              ) : isRegistering ? (
                <>
                  Register Account <ArrowRight size={18} />
                </>
              ) : (
                <>
                  Secure Login <ArrowRight size={18} />
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="switch-mode-btn" 
              onClick={toggleMode}
            >
              {isRegistering ? 'Already have an account?' : 'New to DevTrack?'} 
              <span>{isRegistering ? 'Log in here' : 'Create an account'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
