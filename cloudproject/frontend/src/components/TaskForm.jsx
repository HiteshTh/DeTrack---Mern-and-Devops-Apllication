import { useState } from 'react';

const TaskForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title,
      description,
      priority,
      status: 'To Do'
    });
  };

  return (
    <div className="task-form-container">
      <div className="login-header">
        <h2>Deploy New Task</h2>
        <p className="text-muted">Create a new task for the DevOps pipeline.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="e.g. Update Kubernetes Secrets"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description (Markdown Supported)</label>
          <textarea 
            className="glass-input" 
            placeholder="Describe the task. You can use markdown for code blocks."
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Priority</label>
          <select 
            className="glass-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ appearance: 'none', cursor: 'none' }}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn primary-fab" style={{ width: 'auto', padding: '12px 32px' }}>
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
