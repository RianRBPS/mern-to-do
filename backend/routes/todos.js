const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

router.post('/todos', async (req, res) => {
    const { task, status } = req.body;
    try {
        const todo = await Todo.create({ task, status });
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

module.exports = router;