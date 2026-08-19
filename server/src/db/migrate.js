const fs = require('fs/promises');
const path = require('path');
const { pool } = require('./index');

async function runMigration() {
  const migrationPath = path.join(__dirname, 'migrations', '001_create_studyflow_tables.sql');
  const migrationSql = await fs.readFile(migrationPath, 'utf8');

  await pool.query(migrationSql);
  console.log('StudyFlow PostgreSQL tables and indexes are ready.');
}

runMigration()
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
