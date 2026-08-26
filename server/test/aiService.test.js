const {
  generateStudyPlan,
  parsePlanResponse,
} = require('../src/services/aiService');

const input = {
  subject: 'JavaScript',
  topics: 'Promises and async/await',
  hoursPerDay: 2,
  days: 2,
};

describe('AI study plan service', () => {
  const originalApiKey = process.env.LLM_API_KEY;

  afterEach(() => {
    if (originalApiKey === undefined) delete process.env.LLM_API_KEY;
    else process.env.LLM_API_KEY = originalApiKey;
    jest.restoreAllMocks();
  });

  test('sends a constrained JSON prompt and returns the validated plan', async () => {
    process.env.LLM_API_KEY = 'test-key';
    const providerResponse = {
      plan: [
        { day: 1, topic: 'Promises', durationMinutes: 60, goal: 'Explain promise states.' },
        { day: 2, topic: 'Async/await', durationMinutes: 90, goal: 'Rewrite a promise chain.' },
      ],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify(providerResponse) } }] }),
    });

    await expect(generateStudyPlan(input)).resolves.toEqual(providerResponse.plan);

    const request = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer test-key');
    expect(request.response_format).toEqual({ type: 'json_object' });
    expect(request.messages[1].content).toContain('Do not invent prerequisites');
    expect(request.messages[1].content).toContain('exactly 2 daily plan entries');
  });

  test('rejects malformed structured output', () => {
    expect(() => parsePlanResponse('{"plan":[{"day":1}]}', 1)).toThrow(
      'The AI returned an invalid study-plan item.',
    );
  });

  test('fails clearly when the server-side API key is missing', async () => {
    delete process.env.LLM_API_KEY;

    await expect(generateStudyPlan(input)).rejects.toMatchObject({
      statusCode: 503,
      message: 'AI study-plan generation is not configured.',
    });
  });
});