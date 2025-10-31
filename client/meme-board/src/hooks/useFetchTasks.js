import { useState, useEffect, useCallback } from 'react';
import { getTasks, completeTask } from '../services/api';

export const useFetchTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      // normalizar: res puede ser { data: [...] } (mock) o axiosResponse
      const data = res && res.data ? res.data : res;
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('⚠️ API no disponible, usando tareas simuladas:', err);
      setTasks([
        { id: '1', title: 'Hacer la cama', status: 'pending' },
        { id: '2', title: 'Lavar los platos', status: 'pending' },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const toggleTask = async (id, currentUser) => {
    try {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t
        )
      );
      await completeTask(id, currentUser);
    } catch (err) {
      console.error('❌ Error completando tarea:', err);
    }
  };

  return { tasks, loading, reload, setTasks, toggleTask };
};
