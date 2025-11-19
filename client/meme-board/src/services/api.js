import axios from 'axios';

/* ==========================================================
CONFIGURACIÓN BASE
========================================================== */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/* ==========================================================
AUTH
========================================================== */

export const registerUser = async (data) => {
  return api.post('/auth/register', data);
};

export const loginUser = async (data) => {
  return api.post('/auth/login', data);
};

export const getCurrentUser = async () => {
  return api.get('/auth/me');
};

/* ==========================================================
TASKS
========================================================== */

export const getTasks = async () => {
  return api.get('/tasks');
};

export const createTask = async (task) => {
  return api.post('/tasks', task);
};

export const completeTask = async (id, currentUser) => {
  return api.patch(`/tasks/${id}/complete`, { userId: currentUser.id });
};

export const deleteTask = async (id) => {
  return api.delete(`/tasks/${id}`);
};
/* ==========================================================
MEMES
========================================================== */

export const uploadMeme = async (id, memeUrl, currentUser) => {
  return api.patch(`/tasks/${id}/meme`, {
    meme: memeUrl,
    userId: currentUser.id,
  });
};

export const getMemes = async () => {
  return api.get('/memes');
};
