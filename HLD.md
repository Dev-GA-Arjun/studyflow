# StudyFlow High-Level Design

## Architecture

StudyFlow uses a React client and a Node.js server. The client communicates with the server through HTTP APIs. Persistent data is owned by the server and its database layer.

## Components

- Client: UI, pages, hooks, and API services.
- Server: routes, controllers, domain services, middleware, models, and database access.
