const express = require('express');
const cors = require('cors');

const allowedClientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();

app.use(cors({ origin: allowedClientOrigin }));
app.use(express.json());

app.get('/api/health', (request, response) => {
	response.status(200).json({ status: 'ok', service: 'studyflow-server' });
});

app.use((request, response) => {
	response.status(404).json({ error: 'Route not found' });
});

app.use((error, request, response, next) => {
	console.error(error);
	response.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
