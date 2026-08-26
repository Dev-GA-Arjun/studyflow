const { AppError } = require('../middleware/errors');

const defaultApiUrl = 'https://api.openai.com/v1/chat/completions';

function buildPrompt({ subject, topics, hoursPerDay, days }) {
  return `You are StudyFlow's study planning assistant. Create a practical study plan for a student.

Student input:
- Subject: ${subject}
- Topics: ${topics}
- Available study time per day: ${hoursPerDay} hours
- Number of study days: ${days}

Task:
Create exactly ${days} daily plan entries that use only the supplied subject and topics.

Constraints:
- Keep each durationMinutes a positive integer and do not exceed ${hoursPerDay * 60} minutes per day.
- Give each day one focused topic and one measurable goal.
- Make the sequence progress from foundational work to practice or review when the topics allow it.
- Do not invent prerequisites, deadlines, resources, or personal information that the student did not provide.

Expected output:
Return valid JSON only, with this exact shape: {"plan":[{"day":1,"topic":"...","durationMinutes":60,"goal":"..."}]}
Do not wrap the JSON in Markdown fences or add commentary.`;
}

function parsePlanResponse(content, expectedDays) {
  let parsed;
  try {
    parsed = JSON.parse(content.replace(/^```json\s*|\s*```$/g, '').trim());
  } catch {
    throw new AppError(502, 'The AI returned malformed study-plan JSON.');
  }

  if (!parsed || !Array.isArray(parsed.plan) || parsed.plan.length !== expectedDays) {
    throw new AppError(502, 'The AI returned an invalid study-plan structure.');
  }

  parsed.plan.forEach((entry, index) => {
    if (!entry || entry.day !== index + 1
      || typeof entry.topic !== 'string' || entry.topic.trim() === ''
      || !Number.isInteger(entry.durationMinutes) || entry.durationMinutes < 1
      || typeof entry.goal !== 'string' || entry.goal.trim() === '') {
      throw new AppError(502, 'The AI returned an invalid study-plan item.');
    }
  });

  return parsed.plan;
}

async function generateStudyPlan(input) {
  if (!process.env.LLM_API_KEY) {
    throw new AppError(503, 'AI study-plan generation is not configured.');
  }

  let response;
  try {
    response = await fetch(process.env.LLM_API_URL || defaultApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You produce concise, valid JSON for StudyFlow.' },
          { role: 'user', content: buildPrompt(input) },
        ],
      }),
    });
  } catch {
    throw new AppError(502, 'The AI provider could not be reached.');
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new AppError(502, 'The AI provider rejected the study-plan request.');
  }

  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new AppError(502, 'The AI provider returned no study plan.');
  }

  return parsePlanResponse(content, input.days);
}

module.exports = { buildPrompt, generateStudyPlan, parsePlanResponse };