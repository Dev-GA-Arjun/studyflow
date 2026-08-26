# JavaScript Concepts in StudyFlow

These concepts are demonstrated by reachable application code rather than disconnected snippets.

| Concept               | File                                       | Function/section                       | How it is demonstrated                                                                                                                                  |
| --------------------- | ------------------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Async/await           | `server/src/controllers/taskController.js` | `listTasks`, `createTask`              | Controllers await real task service/database operations before sending API responses.                                                                   |
| Event Loop            | `server/test/javascript-concepts.test.js`  | rejected `asyncHandler` test           | The synchronous code records `after handler call` before the Promise rejection reaches `next`, showing that the continuation runs in a later microtask. |
| Promises vs callbacks | `server/src/middleware/errors.js`          | `asyncHandler`                         | The controller returns a Promise, while Express supplies the callback-style `next`; `.catch(next)` adapts between them. The test executes this path.    |
| Closures              | `client/src/pages/TasksPage.jsx`           | `useEffect` cleanup and `loadPageData` | `loadPageData` closes over `isCurrent`, and the cleanup changes that closed-over value so stale requests cannot update state after unmount.             |
| Hoisting              | `server/src/controllers/taskController.js` | `validateStatus`, `validateDueDate`    | These function declarations are callable from later controller declarations because JavaScript hoists their declarations within the module scope.       |

Run the executable demonstration with:

```bash
cd server
npm test -- javascript-concepts.test.js
```
