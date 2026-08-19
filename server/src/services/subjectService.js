const { query } = require('../db');

async function findSubjects(userId) {
  if (userId) {
    const result = await query(
      `SELECT id, user_id, name, description, created_at
       FROM subjects
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  const result = await query(
    `SELECT id, user_id, name, description, created_at
     FROM subjects
     ORDER BY created_at DESC`,
  );
  return result.rows;
}

async function findSubjectById(id) {
  const result = await query(
    `SELECT id, user_id, name, description, created_at
     FROM subjects
     WHERE id = $1`,
    [id],
  );
  return result.rows[0] || null;
}

async function createSubject({ userId, name, description }) {
  const result = await query(
    `INSERT INTO subjects (user_id, name, description)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, name, description, created_at`,
    [userId, name, description],
  );
  return result.rows[0];
}

async function updateSubject(id, { name, description }) {
  const result = await query(
    `UPDATE subjects
     SET name = COALESCE($1, name), description = COALESCE($2, description)
     WHERE id = $3
     RETURNING id, user_id, name, description, created_at`,
    [name, description, id],
  );
  return result.rows[0] || null;
}

async function deleteSubject(id) {
  const result = await query('DELETE FROM subjects WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
}

module.exports = {
  findSubjects,
  findSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
