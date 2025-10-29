import { useState, useEffect } from 'react';
import { getTasks, completeTask } from '../services/api';

export const useFetchTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await getTasks();
        // Convertimos status a completed booleano
        const mappedTasks = data.map((t) => ({
          ...t,
          completed: t.status === 'completed',
        }));
        setTasks(mappedTasks);
      } catch (error) {
        console.warn('⚠️ API no disponible, usando tareas simuladas', error);
        setTasks([
          { id: '1', title: 'Hacer la cama', completed: false, status: 'pending' },
          { id: '2', title: 'Lavar los platos', completed: false, status: 'pending' },
          { id: '3', title: 'Sacar la basura', completed: false, status: 'pending' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const toggleTask = async (id, currentUser) => {
    try {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                status: task.status === 'pending' ? 'completed' : 'pending',
                completed: task.status === 'pending',
              }
            : task
        )
      );
      await completeTask(id, currentUser);
    } catch (error) {
      console.error('❌ Error completando tarea:', error);
    }
  };

  return { tasks, setTasks, loading, toggleTask };
};
