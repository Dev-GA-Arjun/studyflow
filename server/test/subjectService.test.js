jest.mock('../src/db', () => ({
  query: jest.fn(),
}));

const { query } = require('../src/db');
const {
  findSubjects,
  findSubjectById,
  createSubject,
} = require('../src/services/subjectService');

describe('subject service', () => {
  beforeEach(() => {
    query.mockClear();
  });

  test('finds subjects for a user and returns database rows', async () => {
    const subjects = [{ id: 3, user_id: 7, name: 'SQL' }];
    query.mockResolvedValue({ rows: subjects });

    await expect(findSubjects(7)).resolves.toEqual(subjects);

    expect(query).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = $1'), [7]);
  });

  test('returns null when a subject id is not found', async () => {
    query.mockResolvedValue({ rows: [] });

    await expect(findSubjectById(99)).resolves.toBeNull();
    expect(query).toHaveBeenCalledWith(expect.stringContaining('WHERE id = $1'), [99]);
  });

  test('creates a subject with parameterized values', async () => {
    const subject = { id: 4, user_id: 7, name: 'PostgreSQL', description: null };
    query.mockResolvedValue({ rows: [subject] });

    await expect(createSubject({ userId: 7, name: 'PostgreSQL', description: null }))
      .resolves.toEqual(subject);

    expect(query.mock.calls[0][1]).toEqual([7, 'PostgreSQL', null]);
  });
});