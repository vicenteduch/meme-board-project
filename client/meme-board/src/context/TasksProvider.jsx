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

    try {
      const res = await getTasks();
      const data = res.data || res;
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (err) {
      console.error('❌ Error loading tasks from API:', err);
      setError('Could not load tasks.');
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
      const res = await completeTask(id, currentUser);
      const updatedTask = res.data || res;

      setTasks((prev) => prev.map((t) => (t.id === id || t._id === id ? updatedTask : t)));
    } catch (err) {
      console.error('❌ Error updating task:', err);
      setError('Could not update task');
    }
  };

  const updateTaskLocal = (id, newData) => {
    setTasks((prev) => prev.map((t) => (t.id === id || t._id === id ? { ...t, ...newData } : t)));
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id && t._id !== id));
    } catch (err) {
      console.error('❌ Error deleting task:', err);
      setError('Could not delete task');
    }
  };

  const resetTasks = () => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        status: 'pending',
        meme: null,
        expanded: false,
      }))
    );
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
        updateTaskLocal,
        removeTask,
        resetTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
