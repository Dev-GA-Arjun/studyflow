const fs = require('fs/promises');
const path = require('path');
const { pool } = require('./index');

async function runMigration() {
  const migrationsDirectory = path.join(__dirname, 'migrations');
  const migrationFiles = (await fs.readdir(migrationsDirectory))
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort();

  for (const migrationFile of migrationFiles) {
    const migrationPath = path.join(migrationsDirectory, migrationFile);
    const migrationSql = await fs.readFile(migrationPath, 'utf8');
    await pool.query(migrationSql);
    console.log(`Applied migration ${migrationFile}.`);
  }
}

runMigration()
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
