import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import { useFetchTasks } from '../hooks/useFetchTasks';
import { useAddMeme } from '../hooks/useAddMeme';

export default function BoardPage() {
  const { tasks, setTasks, loading, toggleTask } = useFetchTasks();
  const { addMeme } = useAddMeme();
  const [showForm, setShowForm] = useState(false);

  const currentUser = { id: 'user1', role: 'admin' }; // Simulated current user

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;

  const handleComplete = async (task) => {
    if (task.completed) return;

    await toggleTask(task.id, currentUser);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, completed: true, status: 'completed', meme: task.meme } : t
      )
    );
    await addMeme(task.id, task.meme, currentUser);
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
    setShowForm(false);
  };

  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10 bg-[url('https://wallpapers.com/images/high/cork-board-background-2000-x-1328-0z2f3nkzu8w4q19a.webp')] bg-cover bg-center bg-no-repeat pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center mb-6">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-full shadow-md transition-transform duration-200 hover:scale-105"
          >
            {showForm ? '❌ Cancelar' : '➕ Nueva tarea'}
          </button>
        </div>

        {showForm && (
          <div
            className="max-w-md mx-auto mb-6 animate-fadeIn"
            style={{
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            <TaskForm currentUserId="user1" onCreated={handleTaskCreated} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleComplete(task)}
              className="relative p-4 rounded-md shadow-lg cursor-pointer transition-transform transform hover:scale-105 bg-yellow-200"
              style={{
                transform: `rotate(${Math.random() * 4 - 2}deg)`,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1), inset 0 0 5px rgba(255,255,255,0.5)',
              }}
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-inner"></div>

              <p className="text-lg text-gray-800 font-semibold mt-3">{task.title}</p>
              <p className="text-sm text-gray-600 mb-2">
                {task.completed ? '✅ Completed' : '🕓 Pending'}
              </p>

              {task.completed && task.meme && (
                <img
                  src={task.meme}
                  alt="Meme"
                  className="w-full h-32 object-cover rounded mt-2 transition-all duration-300 hover:scale-105"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
