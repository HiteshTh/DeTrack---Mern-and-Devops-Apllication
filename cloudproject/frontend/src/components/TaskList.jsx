import TaskCard from './TaskCard';

const TaskList = ({ title, tasks, onUpdateStatus, onDelete, onOpenZenMode, accent, layout = 'vertical' }) => {
  return (
    <div className="task-list">
      <div className="list-header">
        <h3 className={`list-title ${accent ? `accent-${accent}` : ''}`}>
          {accent && <div className="indicator"></div>}
          {title}
          <span className="badge" style={{ marginLeft: '8px' }}>{tasks.length}</span>
        </h3>
      </div>
      
      <div className={`tasks-container layout-${layout}`}>
        {tasks.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', marginTop: '20px', width: '100%' }}>
            No tasks found.
          </p>
        ) : (
          tasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onUpdateStatus={onUpdateStatus}
              onDelete={onDelete}
              onOpenZenMode={onOpenZenMode}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
