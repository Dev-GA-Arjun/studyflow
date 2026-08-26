import { apiRequest } from './api';

export async function getTasks() {
  const data = await apiRequest('/tasks');
  return data.tasks;
}

export async function createTask(task) {
  const data = await apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });
  return data.task;
}