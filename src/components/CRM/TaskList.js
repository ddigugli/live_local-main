import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CRM.css';
import { getAllTasks, removeTask } from '../../services/crmService';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      console.log('Loading tasks...');
      const data = await getAllTasks();
      console.log('Tasks loaded:', data);
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await removeTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  };

  return (
    <div className="crm-list-page">
      <div className="crm-list-header">
        <h1>Tasks</h1>
        <Link to="/crm/tasks/new" className="btn btn-primary">+ New Task</Link>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading tasks...</div>}

      {!loading && tasks.length === 0 && (
        <div className="empty-state">
          <p>No tasks found. <Link to="/crm/tasks/new">Create one</Link></p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <table className="crm-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td><strong>{task.title}</strong></td>
                <td><span className={`status ${task.status}`}>{task.status}</span></td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
                <td>{task.description ? task.description.substring(0, 50) + '...' : '—'}</td>
                <td>
                  <Link to={`/crm/tasks/${task.id}`} className="link-btn">View</Link>
                  <Link to={`/crm/tasks/${task.id}/edit`} className="link-btn">Edit</Link>
                  <button onClick={() => handleDelete(task.id)} className="link-btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;
