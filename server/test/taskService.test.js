jest.mock('../src/db', () => ({
  query: jest.fn(),
}));

const { query } = require('../src/db');
const { findTasks, summarizeTasks } = require('../src/services/taskService');

describe('task query service', () => {
  beforeEach(() => {
    query.mockClear();
    query.mockResolvedValue({ rows: [] });
  });

  test('filters by status with a parameter and orders by due date', async () => {
    await findTasks('pending');

    const [sql, values] = query.mock.calls[0];
    expect(sql).toContain('WHERE tasks.status = $1');
    expect(sql).toContain('ORDER BY tasks.due_date ASC NULLS LAST, tasks.created_at DESC');
    expect(values).toEqual(['pending']);
  });

  test('groups task counts by subject', async () => {
    await summarizeTasks();

    const [sql, values] = query.mock.calls[0];
    expect(sql).toContain('COUNT(tasks.id)::int AS total_tasks');
    expect(sql).toContain('GROUP BY subjects.id, subjects.name');
    expect(sql).toContain('ORDER BY subjects.name ASC');
    expect(values).toBeUndefined();
  });
});