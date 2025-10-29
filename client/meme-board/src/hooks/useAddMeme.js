import { useState } from 'react';
import { uploadMeme } from '../services/api';

export const useAddMeme = () => {
  const [memes, setMemes] = useState([]);

  const addMeme = async (taskId, memeUrl, currentUser) => {
    try {
      const { data } = await uploadMeme(taskId, memeUrl, currentUser);
      // guardamos meme localmente en el hook (opcional)
      setMemes((prev) => [...prev, { id: data.id, idTask: data.id, url: data.meme }]);
    } catch (error) {
      console.warn('⚠️ No se pudo guardar en API, añadiendo localmente', error);
      setMemes((prev) => [...prev, { id: taskId, idTask: taskId, url: memeUrl }]);
    }
  };

  return { memes, addMeme };
};
