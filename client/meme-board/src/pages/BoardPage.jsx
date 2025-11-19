import { useEffect, useState } from 'react';
import TaskForm from '../components/TaskForm';
import { useAddMeme } from '../hooks/useAddMeme';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';

export default function BoardPage() {
  const { user } = useAuth();
  const { tasks, loading, addTask, updateTask, removeTask, resetTasks, updateTaskLocal } =
    useTasks();
  const currentUserId = user?._id || user?.id || user?.name;
  const userTasks = tasks.filter(
    (t) =>
      t.assignedTo === currentUserId ||
      t.assignedTo === user?.name || // por si tienes tareas antiguas con name
      t.assignedTo === user?.id // por compatibilidad
  );
  const { addMeme } = useAddMeme();

  const [showForm, setShowForm] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showMemeModal, setShowMemeModal] = useState(false);
  const [memeUrl, setMemeUrl] = useState('');
  const [currentTask, setCurrentTask] = useState(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [expanded, setExpanded] = useState(() => {
    // 🧠 Al iniciar, cargamos del localStorage
    const saved = localStorage.getItem('expandedTasks');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    // Si el usuario ya tiene preferencias guardadas, las respetamos
    const saved = localStorage.getItem('expandedTasks');
    if (saved) {
      setExpanded(new Set(JSON.parse(saved)));
    } else {
      // Si no hay preferencias, abrimos las completadas por defecto
      const completed = tasks.filter((t) => t.status === 'completed').map((t) => t.id);
      setExpanded(new Set(completed));
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('expandedTasks', JSON.stringify([...expanded]));
  }, [expanded]);

  const currentUser = { id: 'user1', role: 'admin' };

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleComplete = async (task) => {
    if (deleteMode) return;
    if (task.status === 'completed') return;
    await updateTask(task.id, currentUser);
    setCurrentTask(task);
    setShowMemeModal(true);
  };

  const handleTaskCreated = async (newTask) => {
    await addTask(newTask);
    setShowForm(false);
  };

  const handleSelectTask = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleConfirmDelete = async () => {
    for (const id of selectedTasks) await removeTask(id);
    setSelectedTasks([]);
    setShowDeleteModal(false);
    setDeleteMode(false);
  };

  const handleAddMeme = async () => {
    if (memeUrl.trim() && currentTask) {
      try {
        await addMeme(currentTask.id, memeUrl, currentUser);

        // ✅ Actualiza el contexto inmediatamente
        updateTaskLocal(currentTask.id, {
          meme: memeUrl,
          status: 'completed',
          completed: true,
        });

        // 👇 Abre automáticamente la tarea y guarda esa preferencia en localStorage
        setExpanded((prev) => {
          const updated = new Set(prev);
          updated.add(currentTask.id);
          localStorage.setItem('expandedTasks', JSON.stringify([...updated]));
          return updated;
        });
      } catch (err) {
        console.error('❌ Error añadiendo meme:', err);
      }
    }

    setMemeUrl('');
    setCurrentTask(null);
    setShowMemeModal(false);
  };

  const handleConfirmReset = () => {
    resetTasks(); // 🔄 Resetea estados y memes

    // 🔽 Colapsa todas las tarjetas
    setExpanded(new Set());

    // ❌ Cierra el modal
    setShowResetModal(false);
  };

  return (
    <div className="relative min-h-screen pt-20">
      {/* 🧱 Fondo */}
      <div className="fixed inset-0 -z-10 bg-[url('https://wallpapers.com/images/high/cork-board-background-2000-x-1328-0z2f3nkzu8w4q19a.webp')] bg-cover bg-center bg-no-repeat pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* 🧭 Barra menú */}
        <div className="sticky top-[64px] bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg py-4 px-6 mb-6 flex justify-center items-center gap-4 flex-wrap z-30">
          <button
            onClick={() => setShowForm((p) => !p)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-full shadow-md transition-transform duration-200 hover:scale-105"
          >
            {showForm ? '❌ Cancelar' : '➕ Nueva tarea'}
          </button>

          <button
            onClick={() => setDeleteMode((p) => !p)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              deleteMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {deleteMode ? '❌ Cancelar eliminación' : '🗑️ Eliminar tareas'}
          </button>

          {deleteMode && selectedTasks.length > 0 && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full"
            >
              Confirmar eliminación ({selectedTasks.length})
            </button>
          )}

          {/* ♻️ Resetear tareas */}
          <button
            onClick={() => setShowResetModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full shadow-md transition-transform duration-200 hover:scale-105"
          >
            ♻️ Resetear tareas
          </button>
        </div>

        {!loading && userTasks.length === 0 && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-white/80 rounded-lg shadow-md text-center">
            <p className="text-gray-800 font-semibold mb-1">👋 Welcome to your board!</p>
            <p className="text-gray-600 text-sm">
              You have no tasks yet. Click{' '}
              <span className="font-bold text-yellow-600">“New task”</span> to create your first
              one.
            </p>
          </div>
        )}

        {/* ✏️ Formulario */}
        {showForm && (
          <div
            className="max-w-md mx-auto mb-8 animate-fadeIn"
            style={{ animation: 'fadeIn 0.3s ease-in-out' }}
          >
            <TaskForm currentUserId={currentUserId} onCreated={handleTaskCreated} />
          </div>
        )}

        {/* 📋 Tareas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {userTasks.map((task) => {
            const isExpanded = expanded.has(task.id);
            return (
              <div
                key={task.id}
                onClick={() => (deleteMode ? handleSelectTask(task.id) : handleComplete(task))}
                className={`relative rounded-md shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden ${
                  selectedTasks.includes(task.id)
                    ? 'bg-red-300 border-2 border-red-500'
                    : task.status === 'completed'
                      ? 'bg-green-200'
                      : 'bg-yellow-200'
                } ${isExpanded ? 'h-96' : 'h-40'} flex flex-col`}
              >
                {deleteMode && (
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    readOnly
                    className="absolute top-2 left-2 scale-125 accent-red-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-inner" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(task.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-900/60 text-white flex items-center justify-center hover:bg-gray-800"
                  title={isExpanded ? 'Reducir' : 'Ampliar'}
                >
                  {isExpanded ? '−' : '+'}
                </button>

                <div className="p-3 text-center shrink-0">
                  <p className="text-lg text-gray-800 font-semibold">{task.title}</p>
                  <p className="text-sm text-gray-600">
                    {task.status === 'completed' ? '✅ Completed' : '🕓 Pending'}
                  </p>
                </div>

                {isExpanded && task.status === 'completed' && task.meme && (
                  <div className="flex-1 flex justify-center items-center bg-white/40 rounded-b-md px-2 pb-2">
                    <img
                      src={task.meme}
                      alt="Meme"
                      className="max-h-full max-w-full object-contain transition-all duration-300"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🧾 Modal eliminar */}
      {showDeleteModal && (
        <ModalConfirm
          title={`¿Eliminar ${selectedTasks.length} tarea${selectedTasks.length > 1 ? 's' : ''}?`}
          message="Esta acción no se puede deshacer. ¿Seguro que quieres continuar?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* ♻️ Modal reset */}
      {showResetModal && (
        <ModalConfirm
          title="¿Reiniciar todas las tareas?"
          message="Esto pondrá todas las tareas como pendientes y eliminará los memes asignados."
          onConfirm={handleConfirmReset}
          onCancel={() => setShowResetModal(false)}
        />
      )}

      {/* 🖼️ Modal añadir meme */}
      {showMemeModal && (
        <MemeModal
          memeUrl={memeUrl}
          setMemeUrl={setMemeUrl}
          onSave={handleAddMeme}
          onCancel={() => setShowMemeModal(false)}
        />
      )}
    </div>
  );
}

/* 🔹 Modal genérico de confirmación */
function ModalConfirm({ title, message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-gray-900 p-8 rounded-xl text-white shadow-lg w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-gray-300 text-center mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
          >
            Sí, continuar
          </button>
          <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Modal para añadir memes */
function MemeModal({ memeUrl, setMemeUrl, onSave, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-gray-900 p-8 rounded-xl text-white shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-center text-amber-400">
          ¿Quieres añadir un meme a esta tarea? 😎
        </h2>

        <input
          type="text"
          value={memeUrl}
          onChange={(e) => setMemeUrl(e.target.value)}
          placeholder="Pega aquí el enlace de tu meme..."
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        {memeUrl && (
          <div className="mb-4 flex justify-center">
            <img src={memeUrl} alt="Preview" className="max-h-40 object-contain rounded" />
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={onSave}
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg"
          >
            Guardar meme
          </button>
          <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg">
            No añadir
          </button>
        </div>
      </div>
    </div>
  );
}
