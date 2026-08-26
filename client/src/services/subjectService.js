import { apiRequest } from './api';

export async function getSubjects() {
  const data = await apiRequest('/subjects');
  return data.subjects;
}