const mongoose = require('mongoose');
const express = require('express');
const app = express();
const User = require('./models/User');
const Todo = require('./models/Todo');

// responds with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.send('hello world');
})

mongoose.connect(process.env.MONGO_URI). // instead of hardcoding
    catch(err => console.error('mongo connection error:', err)); // handling startup connection issues

mongoose.connection.on('error', err => {
    console.error('mongo runtime error:', err);
});
