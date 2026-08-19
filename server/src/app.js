const express = require('express');
const cors = require('cors');
const subjectRoutes = require('./routes/subjectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler } = require('./middleware/errors');

const allowedClientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();

app.use(cors({ origin: allowedClientOrigin }));
app.use(express.json());

app.get('/api/health', (request, response) => {
	response.status(200).json({ status: 'ok', service: 'studyflow-server' });
});

app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);

app.use((request, response) => {
	response.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
