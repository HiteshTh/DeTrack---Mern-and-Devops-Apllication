const mongoose = require('mongoose');

const CommitSchema = new mongoose.Schema({
  sha:      { type: String },
  message:  { type: String },
  author:   { type: String },
  url:      { type: String },
  timestamp:{ type: Date }
});

const GitHubActivitySchema = new mongoose.Schema({
  event:       { type: String, default: 'push' },  // push | pull_request | issues
  repoName:    { type: String },
  repoUrl:     { type: String },
  pusher:      { type: String },
  branch:      { type: String },
  commits:     [CommitSchema],
  linkedTasks: [{ type: String }],  // e.g. ['DEV-101', 'DEV-203']
  receivedAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('GitHubActivity', GitHubActivitySchema);
