import { apiRequest } from './api';

export async function generateStudyPlan(input) {
  const data = await apiRequest('/ai/study-plan', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.plan;
}