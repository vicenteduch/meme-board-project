import { useState } from 'react';

export default function TaskForm({ onCreated, currentUserId = 'user1' }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [effort, setEffort] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError('El título es obligatorio');

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      assignedTo: currentUserId,
      effortPoints: Number(effort) || 1,
      status: 'pending',
      meme: null,
    };

    try {
      setLoading(true);
      if (onCreated) {
        await onCreated(newTask); // ✅ delega al contexto
      }
      setTitle('');
      setDescription('');
      setEffort(1);
    } catch (err) {
      console.error('❌ Error al crear tarea:', err);
      setError('No se pudo crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-yellow-100/90 backdrop-blur-sm border-2 border-yellow-300 rounded-2xl shadow-md p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg"
    >
      <h2 className="text-xl font-bold text-gray-800 text-center mb-2">✏️ Añadir nueva tarea</h2>

      {error && (
        <p className="bg-red-100 text-red-700 text-sm p-2 rounded-md border border-red-300">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Lavar los platos"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Añade algunos detalles..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
          rows={2}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">Puntos de esfuerzo:</label>
        <select
          value={effort}
          onChange={(e) => setEffort(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          {[1, 2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 ${
          loading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-gray-900 shadow-md'
        }`}
      >
        {loading ? 'Creando...' : '✨ Crear tarea'}
      </button>
    </form>
  );
}
