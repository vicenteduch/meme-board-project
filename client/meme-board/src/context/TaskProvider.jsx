import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, completeTask, deleteTask } from '../services/api';
import { TasksContext } from './TasksContext.jsx';

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTasks();
      const data = res.data || res;
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (task) => {
    try {
      const res = await createTask(task);
      const newTask = res.data || res;
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      console.error('❌ Error creating task:', err);
      setError('Could not create task');
    }
  };

  const updateTask = async (id, currentUser) => {
    try {
      await completeTask(id, currentUser);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t
        )
      );
    } catch (err) {
      console.error('❌ Error updating task:', err);
      setError('Could not update task');
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
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
