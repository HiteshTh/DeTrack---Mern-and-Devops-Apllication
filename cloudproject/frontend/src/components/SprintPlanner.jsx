import { useState } from 'react';
import { Sparkles, Brain, AlertTriangle, Clock, Target, Loader2, CheckCircle } from 'lucide-react';

const SprintPlanner = ({ tasks }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState(null);

  const pendingTasks = tasks.filter(t => t.status !== 'Done');

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/plan-sprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: pendingTasks })
      });
      
      const data = await response.json();
      if (response.ok && data.insights) {
        setInsights(data.insights);
      } else {
        console.error("AI Analysis failed:", data.error);
        alert(`AI Analysis failed: ${data.error || 'Check backend console'}`);
      }
    } catch (err) {
      console.error("Network error during AI analysis:", err);
      alert("Network error. Is the backend running?");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'High': return '#ef4444'; // red
      case 'Medium': return '#f59e0b'; // orange
      default: return '#10b981'; // green
    }
  };

  return (
    <div className="list-view-container fade-in" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 className="view-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Brain color="#8b5cf6" size={28} /> AI Sprint Planner
          </h2>
          <p className="text-muted" style={{ marginTop: '5px' }}>Let our AI engine analyze your backlog for auto-estimation and risk detection.</p>
        </div>
        
        <button 
          className="fancy-btn" 
          onClick={runAiAnalysis} 
          disabled={isAnalyzing || pendingTasks.length === 0}
          style={{ width: 'auto', padding: '0 20px', margin: 0, height: '44px', display: 'flex', gap: '10px' }}
        >
          {isAnalyzing ? (
            <><Loader2 size={18} className="loader-spinner" /> Analyzing Backlog...</>
          ) : (
            <><Sparkles size={18} /> Generate AI Sprint Plan</>
          )}
        </button>
      </div>

      {pendingTasks.length === 0 && !isAnalyzing && !insights && (
        <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
          <CheckCircle size={48} color="#10b981" style={{ marginBottom: '15px' }} />
          <h3>No Pending Tasks</h3>
          <p className="text-muted">Your backlog is empty. Deploy new tasks to use the AI Planner.</p>
        </div>
      )}

      {insights && !isAnalyzing && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', paddingBottom: '50px' }}>
          {pendingTasks.map((task) => {
            const insight = insights.find(i => i.taskId === task._id) || {};
            
            return (
              <div key={task._id} className="task-card" style={{ cursor: 'default', transform: 'none', background: 'linear-gradient(145deg, rgba(30, 30, 35, 0.7), rgba(20, 20, 25, 0.9))', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#fff' }}>{task.title}</h3>
                  <span className="priority-badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                    {task.taskId}
                  </span>
                </div>
                
                <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '20px', lineHeight: '1.4' }}>{task.description}</p>
                
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', borderLeft: `3px solid ${getRiskColor(insight.riskLevel)}` }}>
                  
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff' }}>
                      <Target size={16} color="#8b5cf6" />
                      <span style={{ fontWeight: 'bold' }}>{insight.storyPoints} Pts</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff' }}>
                      <Clock size={16} color="#3b82f6" />
                      <span>~{insight.estimatedDays} Days</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <AlertTriangle size={16} color={getRiskColor(insight.riskLevel)} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: getRiskColor(insight.riskLevel), fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>
                        {insight.riskLevel} Risk Detected
                      </div>
                      <div style={{ color: '#d1d5db', fontSize: '0.85rem', lineHeight: '1.3' }}>
                        {insight.riskReason}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* AI Decorative Elements */}
      <div className="shape shape-3" style={{ top: '10%', right: '10%', opacity: 0.3, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(0,0,0,0) 70%)' }}></div>
    </div>
  );
};

export default SprintPlanner;
