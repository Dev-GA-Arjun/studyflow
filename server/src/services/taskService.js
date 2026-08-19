const { query } = require('../db');

async function findTasks(status) {
  const values = [];
  let statusFilter = '';

  if (status) {
    values.push(status);
    statusFilter = 'WHERE tasks.status = $1';
  }

  const result = await query(
    `SELECT tasks.id, tasks.subject_id, tasks.title, tasks.description,
            tasks.due_date, tasks.status, tasks.created_at,
            subjects.name AS subject_name, subjects.description AS subject_description
     FROM tasks
     INNER JOIN subjects ON subjects.id = tasks.subject_id
     ${statusFilter}
     ORDER BY tasks.due_date ASC NULLS LAST, tasks.created_at DESC`,
    values,
  );
  return result.rows;
}

async function findTaskById(id) {
  const result = await query(
    `SELECT tasks.id, tasks.subject_id, tasks.title, tasks.description,
            tasks.due_date, tasks.status, tasks.created_at,
            subjects.name AS subject_name, subjects.description AS subject_description
     FROM tasks
     INNER JOIN subjects ON subjects.id = tasks.subject_id
     WHERE tasks.id = $1`,
    [id],
  );
  return result.rows[0] || null;
}

async function createTask({ subjectId, title, description, dueDate, status }) {
  const result = await query(
    `INSERT INTO tasks (subject_id, title, description, due_date, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, subject_id, title, description, due_date, status, created_at`,
    [subjectId, title, description, dueDate, status],
  );
  return result.rows[0];
}

async function updateTask(id, { title, description, dueDate, status }) {
  const result = await query(
    `UPDATE tasks
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         due_date = COALESCE($3, due_date),
         status = COALESCE($4, status)
     WHERE id = $5
     RETURNING id, subject_id, title, description, due_date, status, created_at`,
    [title, description, dueDate, status, id],
  );
  return result.rows[0] || null;
}

async function deleteTask(id) {
  const result = await query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
}

module.exports = { findTasks, findTaskById, createTask, updateTask, deleteTask };
