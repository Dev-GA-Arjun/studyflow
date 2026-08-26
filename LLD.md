# StudyFlow Low-Level Design

## Client

- `components/` contains reusable UI pieces.
- `pages/` contains route-level views.
- `services/` contains server communication.
- `hooks/` contains reusable React behavior.

## Server

- `routes/` maps HTTP endpoints.
- `controllers/` translates requests into application operations.
- `services/` contains business logic.
- `middleware/` contains cross-cutting request behavior.
- `models/` defines application data structures.
- `db/` contains database configuration and access.

### Error Handling

- `asyncHandler` wraps each asynchronous route controller and calls `next(error)` when its promise rejects.
- `subjectController.getSubject` demonstrates `async`/`await` with a meaningful `try/catch`; its catch forwards the error to Express.
- `AppError(statusCode, message)` carries an intentional response status. `errorHandler` returns `AppError` statuses, maps known PostgreSQL request-data errors to `400`, and returns unexpected failures as `500`.
- Missing subjects and tasks produce `404`; validation failures produce `400`.

### Database Configuration and Relationships

- `db/index.js` loads environment variables before reading `DATABASE_URL` and throws a startup error when it is missing, before constructing `Pool`.
- The migration defines `users.id` as the primary key, `subjects.id` as the primary key with `subjects.user_id` referencing `users.id`, and `tasks.id` as the primary key with `tasks.subject_id` referencing `subjects.id`. Cascading deletes preserve referential integrity.
