import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Headphones, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

const ZenMode = ({ task, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);

   
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#0f172a',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      color: '#fff',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      {/* Background ambient gradient */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(15,23,42,0) 70%)',
        zIndex: -1, pointerEvents: 'none'
      }}></div>

      {/* Header */}
      <div style={{ padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Headphones size={24} color="#38bdf8" />
          <span style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: '#94a3b8' }}>Developer Zen Mode</span>
        </div>
        <button 
          onClick={onClose}
          style={{ 
            background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', 
            width: '40px', height: '40px', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'none' 
          }}
          className="fancy-btn"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
        <div style={{ display: 'flex', gap: '60px', width: '100%', maxWidth: '1200px' }}>
          
          {/* Task Details Side */}
          <div style={{ flex: 1, background: 'rgba(30,41,59,0.5)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ background: '#38bdf8', color: '#0f172a', padding: '4px 10px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>{task.taskId}</span>
              <span style={{ color: '#cbd5e1', fontSize: '14px' }}>{task.priority} Priority</span>
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '30px', lineHeight: '1.2' }}>{task.title}</h1>
            <div className="markdown-body" style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.8', maxHeight: '400px', overflowY: 'auto' }}>
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {task.description}
              </ReactMarkdown>
            </div>
          </div>

          {/* Pomodoro Timer Side */}
          <div style={{ width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '300px', height: '300px',
              borderRadius: '50%',
              border: `4px solid ${isActive ? '#38bdf8' : '#334155'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isActive ? '0 0 40px rgba(56, 189, 248, 0.2)' : 'none',
              transition: 'all 0.5s ease',
              marginBottom: '40px'
            }}>
              <span style={{ fontSize: '72px', fontWeight: '900', fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px' }}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <button 
                onClick={toggleTimer}
                style={{
                  background: isActive ? 'rgba(255,255,255,0.1)' : '#38bdf8',
                  color: isActive ? '#fff' : '#0f172a',
                  border: 'none', padding: '15px 40px', borderRadius: '30px',
                  fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px',
                  cursor: 'none', transition: 'all 0.3s ease'
                }}
                className={!isActive ? 'fancy-btn' : ''}
              >
                {isActive ? <Pause size={20} /> : <Play size={20} />}
                {isActive ? 'Pause' : 'Focus'}
              </button>
              
              <button 
                onClick={resetTimer}
                style={{
                  background: 'transparent', color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'none', transition: 'all 0.3s ease'
                }}
              >
                <RotateCcw size={20} />
              </button>
            </div>
            
            {timeLeft === 0 && (
              <div style={{ marginTop: '30px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '18px', animation: 'fadeIn 0.5s ease-out' }}>
                <CheckCircle2 size={24} /> Focus Session Complete!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZenMode;
