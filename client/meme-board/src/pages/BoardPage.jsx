import { useFetchTasks } from '../hooks/useFetchTasks';
import { useAddMeme } from '../hooks/useAddMeme';

export default function BoardPage() {
  const { tasks, setTasks, loading, toggleTask } = useFetchTasks();
  const { addMeme } = useAddMeme();

  const currentUser = { id: 'user1', role: 'admin' }; // usuario mock

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;

  const handleComplete = async (task) => {
    if (task.completed) return;

    // 1️⃣ Marcar como completada
    await toggleTask(task.id, currentUser);

    // 2️⃣ Actualizar localmente con el meme que ya tiene la tarea
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, completed: true, status: 'completed', meme: task.meme } : t
      )
    );

    // 3️⃣ Guardar el meme (aunque en mock ya está definido)
    await addMeme(task.id, task.meme, currentUser);
  };
  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10 bg-[url('https://wallpapers.com/images/high/cork-board-background-2000-x-1328-0z2f3nkzu8w4q19a.webp')] bg-cover bg-center bg-no-repeat pointer-events-none"></div>

      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-center mb-6">My Task Board</h1>

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
