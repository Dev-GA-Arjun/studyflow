# StudyFlow High-Level Design

## Architecture

StudyFlow uses a React client and a Node.js server. The client communicates with the server through HTTP APIs. Persistent data is owned by the server and its database layer.

## Components

- Client: UI, pages, hooks, and API services.
- Server: routes, controllers, domain services, middleware, models, and database access.

## Request and Error Flow

Routes wrap asynchronous controllers with `asyncHandler`. A controller awaits a service operation; rejected promises are forwarded with `next(error)`, and controllers may also forward caught errors directly. The centralized `errorHandler` converts `AppError` status codes into JSON HTTP responses, maps known database/input errors to `400`, and returns unexpected errors as `500`.

## Data and Configuration

PostgreSQL stores users, subjects, and tasks in separate tables. `users.id`, `subjects.id`, and `tasks.id` are primary keys. `subjects.user_id` references `users.id`, and `tasks.subject_id` references `subjects.id`, preserving referential integrity without duplicating user data. `db/index.js` loads dotenv and validates `DATABASE_URL` before creating the connection pool.
