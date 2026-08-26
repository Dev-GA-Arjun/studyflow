CREATE INDEX IF NOT EXISTS tasks_status_due_date_created_at_index
ON tasks (status, due_date ASC NULLS LAST, created_at DESC);