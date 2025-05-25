const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({ // schema names are capitalized for best practices
    name: String,
    password: String,
    createdAt: { type: Date, default: Date.now } // timestamps
})

const User = mongoose.model('User', UserSchema); // allows me to interact with mongodb via mongose to user user.find() and etc

module.exports = User; // allows it to be called on index.js