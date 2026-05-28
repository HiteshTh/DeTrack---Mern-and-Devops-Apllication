const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
  },
  attachmentUrl: {
    type: String,
    default: null, // S3 URL if a file is attached
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Task', TaskSchema);
