import axios from 'axios';

/* ==========================================================
 🧱 CONFIGURACIÓN BASE
========================================================== */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

/* ==========================================================
 ⚙️ MODO MOCK (para desarrollo sin backend)
========================================================== */

const USE_MOCK = true; // cambiar a true para usar datos mock

// Datos de ejemplo
let mockTasks = [
  {
    id: '1',
    title: 'Hacer la cama',
    description: 'Tender las sábanas y dejar la habitación ordenada.',
    assignedTo: 'user1',
    effortPoints: 1,
    status: 'pending',
    meme: 'https://i.imgflip.com/6jh4vk.png',
  },
  {
    id: '2',
    title: 'Limpiar el baño',
    description: 'Fregar lavabo y suelo.',
    assignedTo: 'user2',
    effortPoints: 3,
    status: 'pending',
    meme: 'https://waryhub.com/files/preview/960x960/11747285284swygoxfmz557stdmynqswluszz2mwy9mkowkxzyjcd2gy0erxydtv6eodfjht8zz96kzxpjpl7qfbzplghkfbw0eh4hztspmourk.png?type=free', //
  },
  {
    id: '3',
    title: 'Limpiar arenero del gato',
    description: 'Limpiar y cambiar la arena del arenero.',
    assignedTo: 'user1',
    effortPoints: 1,
    status: 'pending',
    meme: 'https://waryhub.com/files/preview/800x800/11727790597de6nhwm64hyvpkyangqytfyarhgjchghq4iht5yen31dl00spjvk9x6haqtqh5tdw8lbeerlbiawllev4asfwrtwfdezp4b8bxuo.png', //
  },
  {
    id: '4',
    title: 'Limpiar toda la casa.',
    description: 'Aspirar, barrer y fregar todos los suelos de la casa.',
    assignedTo: 'user1',
    effortPoints: 5,
    status: 'pending',
    meme: 'https://waryhub.com/files/preview/960x960/11748962541ebsep0to9bhyojmm9shquzwgvlqyuvogejqymlmksjolrqmeormr6hdckfblzn2vgb1xkpcll644oet36tp1mmtro5fjbkpxzd0k.png?type=free', //
  },
];

let mockUsers = [
  { id: 'user1', name: 'Vicente', role: 'admin' },
  { id: 'user2', name: 'Esther', role: 'member' },
];

/* ==========================================================
 👤 AUTH
========================================================== */

export const registerUser = async (data) => {
  if (USE_MOCK) return { data: { message: 'Usuario registrado (mock)', user: data } };
  return api.post('/auth/register', data);
};

export const loginUser = async (data) => {
  if (USE_MOCK) {
    const user = mockUsers.find((u) => u.name === data.name);
    if (user) return { data: { message: 'Login correcto (mock)', user } };
    throw new Error('Usuario no encontrado (mock)');
  }
  return api.post('/auth/login', data);
};

export const getCurrentUser = async () => {
  if (USE_MOCK) return { data: mockUsers[0] };
  return api.get('/auth/me');
};

/* ==========================================================
 📋 TASKS
========================================================== */

export const getTasks = async () => {
  if (USE_MOCK) return { data: mockTasks };
  return api.get('/tasks');
};

export const createTask = async (task) => {
  if (USE_MOCK) {
    const newTask = { id: Date.now().toString(), ...task, status: 'pending', meme: null };
    mockTasks.push(newTask);
    return { data: newTask };
  }
  return api.post('/tasks', task);
};

export const completeTask = async (id, currentUser) => {
  if (USE_MOCK) {
    const task = mockTasks.find((t) => t.id === id);
    if (!task) throw new Error('Tarea no encontrada');
    if (task.assignedTo !== currentUser.id && currentUser.role !== 'admin') {
      throw new Error('No puedes completar tareas que no son tuyas');
    }
    task.status = 'completed';
    return { data: task };
  }
  return api.patch(`/tasks/${id}/complete`);
};

export const deleteTask = async (id) => {
  if (USE_MOCK) {
    mockTasks = mockTasks.filter((t) => t.id !== id);
    return { data: { message: 'Tarea eliminada (mock)' } };
  }
  return api.delete(`/tasks/${id}`);
};

/* ==========================================================
 😂 MEMES
========================================================== */

export const uploadMeme = async (id, memeUrl, currentUser) => {
  if (USE_MOCK) {
    const task = mockTasks.find((t) => t.id === id);
    if (!task) throw new Error('Tarea no encontrada');
    if (task.assignedTo !== currentUser.id && currentUser.role !== 'admin') {
      throw new Error('No puedes subir memes en tareas ajenas');
    }
    task.meme = memeUrl;
    return { data: { id: task.id, meme: task.meme } }; // solo lo necesario para el hook
  }
  const formData = new FormData();
  formData.append('meme', memeUrl);
  return api.post(`/tasks/${id}/meme`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getMemes = async () => {
  if (USE_MOCK) {
    return {
      data: mockTasks.filter((t) => t.meme).map((t) => ({ id: t.id, idTask: t.id, url: t.meme })),
    };
  }
  return api.get('/memes');
};
