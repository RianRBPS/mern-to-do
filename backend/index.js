const mongoose = require('mongoose');
const express = require('express');
const app = express();
const User = require('./models/User');
const Todo = require('./models/Todo');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
require('dotenv').config

app.use(express.json()); // allows post/put to receive req.body (middleware)

app.use('/api', authRoutes); // routes
app.use('/api', todoRoutes); // .use() method is used to mount middleware functions at a specific path, code that runs before the route handler can modify the req and res objects or handle certain logics (parsing, auth, loggin, etc)

// responds with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.send('hello world');
})

mongoose.connection.on('error', err => {
    console.error('mongo runtime error:', err);
});

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI) // instead of hardcoding
        console.log('connected to mongodb');

        // seed test data
        await User.create({ name: 'Test User', password: 'abc123'});
        await Todo.create({ task: 'clean dishes', status: 'done' });

        app.listen(3000, '0.0.0.0', () => { // starts express server and tells it to listen for incoming https requests on port 3000
            console.log('server running on port 3000'); // binding to 0.0.0.0 makes the app listen to all interfaces, which is needed when running in a docker container
        });
    } catch (err) {
        console.log('mongo connection error:', err); // handling startup connection issues
    }
}

startServer();

