const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({ // schema names are capitalized for best practice
    name: String,
    password: String,
    createdAt: { type: Date, default: Date.now } // timestamps
})

const TodoSchema = new Schema({
    task: String,
    status: String,
    createdAt: { type: Date, default: Date.now }
})

mongoose.connect(process.env.MONGO_URI). // instead of hardcoding
    catch(err => console.error('mongo connection error:', err)); // handling startup connection issues

mongoose.connection.on('error', err => {
    console.error('mongo runtime error:', err);
});

const User = mongoose.model('User', UserSchema); // allows me to inreact with mongodb via mongoose
const Todo = mongoose.model('Todo', TodoSchema); // eg user.find() and todo.create() etc