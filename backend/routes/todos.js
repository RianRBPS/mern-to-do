const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/todos', authenticateToken, async (req, res) => {
    const { task, status } = req.body;
    try {
        const todo = await Todo.create({ task, status, userId:req.user.userId });
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

router.get('/todos', authenticateToken, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.userId });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;