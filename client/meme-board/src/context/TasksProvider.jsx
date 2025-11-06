import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, completeTask, deleteTask } from '../services/api.js';
import { TasksContext } from './TasksContext.jsx';

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('📦 Loaded tasks from localStorage:', parsed);
          setTasks(parsed);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('⚠️ Could not parse localStorage tasks:', err);
      }
    }

    try {
      const res = await getTasks();
      const data = res.data || res;
      if (Array.isArray(data)) {
        setTasks(data);
        localStorage.setItem('tasks', JSON.stringify(data));
      }
    } catch (err) {
      console.error('❌ Error loading tasks from API:', err);
      setError('Could not load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  let lastTaskId = null;

  const addTask = async (task) => {
    try {
      if (task.title === '' || task === lastTaskId) return;
      lastTaskId = task.title;

      const res = await createTask(task);
      const newTask = res.data || res;
      setTasks((prev) => {
        const updated = [...prev, newTask];
        localStorage.setItem('tasks', JSON.stringify(updated));
        return updated;
      });
      return newTask;
    } catch (err) {
      console.error('❌ Error creating task:', err);
      setError('Could not create task');
    }
  };

  const updateTask = async (id, currentUser) => {
    try {
      await completeTask(id, currentUser);
      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: t.status === 'pending' ? 'completed' : 'pending',
                completed: !t.completed, // 🔄 asegúrate de actualizar también esta
              }
            : t
        );
        localStorage.setItem('tasks', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('❌ Error updating task:', err);
      setError('Could not update task');
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => {
        const updated = prev.filter((t) => t.id !== id);
        localStorage.setItem('tasks', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('❌ Error deleting task:', err);
      setError('Could not delete task');
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        loadTasks,
        addTask,
        updateTask,
        removeTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
