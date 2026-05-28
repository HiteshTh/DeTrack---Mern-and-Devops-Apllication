const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../config/aws-config');

// Configure Multer to upload directly to LocalStack S3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'devtrack-task-attachments-localstack', // This will be created by Terraform
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
});

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new task (with optional attachment)
router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    
    let attachmentUrl = null;
    if (req.file) {
      attachmentUrl = req.file.location; // URL returned by multerS3
    }

    const taskId = `DEV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTask = new Task({
      taskId,
      title,
      description,
      priority,
      status,
      attachmentUrl
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a task status/details
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
