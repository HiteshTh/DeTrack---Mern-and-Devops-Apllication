require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const webhookRoutes = require('./routes/webhooks');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl === '/api/webhooks/github') {
      req.rawBody = buf;
    }
  }
}));

// MongoDB Connection
// When running locally, use localhost.
// Inside docker-compose, use 'mongo'.
// Allow overriding via MONGO_URI.
const defaultLocalMongoUri = 'mongodb://127.0.0.1:27017/devtrack';
const defaultComposeMongoUri = 'mongodb://mongo:27017/devtrack';

let MONGO_URI = process.env.MONGO_URI || defaultLocalMongoUri;

// Heuristic: if we're running inside a docker container and no MONGO_URI was provided,
// prefer the compose service name.
if (!process.env.MONGO_URI && process.env.DOCKER_CONTAINER === 'true') {
  MONGO_URI = defaultComposeMongoUri;
  console.log('Using Docker compose Mongo URI:', MONGO_URI);
}

console.log('Connecting to MongoDB at:', MONGO_URI);


mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/ai', aiRoutes);

// Health Check Endpoint (useful for Kubernetes probes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 DevTrack Backend running on port ${PORT}`);
  });
}

module.exports = app;
