const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({ // schema names are capitalized 4 best practice
    task: String,
    status: String,
    createdAt: { type:Date, default:Date.now }, // timestamps
    userId: {
        type: String,
        required: true
    }
})

const Todo = mongoose.model('Todo', TodoSchema); // allows mongoose interaction to mongodb

module.exports = Todo; // allows it to be called on index.js