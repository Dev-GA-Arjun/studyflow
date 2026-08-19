const { pool } = require('./index');

if (!process.env.DEV_SEED_PASSWORD_HASH) {
  throw new Error('DEV_SEED_PASSWORD_HASH is required to seed a user record.');
}

const developmentUser = {
  name: 'Demo Student',
  email: 'demo@studyflow.local',
  passwordHash: process.env.DEV_SEED_PASSWORD_HASH,
};

async function seedDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [developmentUser.name, developmentUser.email, developmentUser.passwordHash],
    );
    const userId = userResult.rows[0].id;

    const subjectResult = await client.query(
      `INSERT INTO subjects (user_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [userId, 'JavaScript', 'Core JavaScript study topics'],
    );
    const subjectId = subjectResult.rows[0].id;

    await client.query(
      `INSERT INTO tasks (subject_id, title, description, due_date, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [subjectId, 'Review promises', 'Practice async and await examples', '2026-09-01', 'pending'],
    );

    await client.query('COMMIT');
    console.log('Development seed data inserted.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

seedDatabase()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
