import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Trash2, Clock, Hash, Headphones } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css'; // or any highlight theme you prefer

const TaskCard = ({ task, onUpdateStatus, onDelete, onOpenZenMode }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'tag-high';
      case 'medium': return 'tag-medium';
      case 'low': return 'tag-low';
      default: return 'tag-medium';
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(task._id, newStatus);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    onDelete(task._id);
    setShowDropdown(false);
  };

  return (
    <div className="task-card floating-panel fade-in">
      <div className="task-header">
        <h3 className="task-title">
          {task.title}
          <div className="task-id-badge">
            <Hash size={12} /> {task.taskId || 'DEV-000'}
          </div>
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button 
            className="action-btn" 
            onClick={() => onOpenZenMode(task)}
            title="Zen Mode"
            style={{ color: '#38bdf8' }}
          >
            <Headphones size={18} />
          </button>
          <div className="dropdown-container" ref={dropdownRef}>
            <button 
              className="action-btn" 
              onClick={() => setShowDropdown(!showDropdown)}
              title="Options"
            >
              <MoreHorizontal size={20} />
            </button>
          
          {showDropdown && (
            <div className="dropdown-menu fade-in">
              {task.status !== 'To Do' && (
                <button className="dropdown-item" onClick={() => handleStatusChange('To Do')}>
                  Move to To Do
                </button>
              )}
              {task.status !== 'In Progress' && (
                <button className="dropdown-item" onClick={() => handleStatusChange('In Progress')}>
                  Move to In Progress
                </button>
              )}
              {task.status !== 'Done' && (
                <button className="dropdown-item" onClick={() => handleStatusChange('Done')}>
                  Move to Done
                </button>
              )}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
              <button className="dropdown-item danger" onClick={handleDelete}>
                <Trash2 size={14} style={{ marginRight: '6px' }} /> Delete Task
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
      
      {/* Code Snippet Vault / Markdown Support */}
      <div className="task-desc markdown-body">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {task.description}
        </ReactMarkdown>
      </div>
      
      <div className="task-meta">
        <span className={`tag ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
        <span className="task-date">
          <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-top' }} />
          {task.date || 'Today'}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
