import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './tailwind.css';
import './index.css';
import { AuthProvider } from './context/AuthProvider.jsx';
import { TasksProvider } from './context/TaskProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TasksProvider>
        <App />
      </TasksProvider>
    </AuthProvider>
  </StrictMode>
);
