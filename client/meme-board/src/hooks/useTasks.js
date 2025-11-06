import { useContext } from 'react';
import { TasksContext } from '../context/TasksContext.jsx';

export const useTasks = () => useContext(TasksContext);
