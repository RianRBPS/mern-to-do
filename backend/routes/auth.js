const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => { // async allows me to use await to handle asynchronous operations like saving to database
    const { name, password } = req.body; // extracts name and password from the body of the incoming request

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({ name, password: hashedPassword}); // tries to create a new user in the mongodb database using the User model, the await keyword tells node.js to pause here until the create operation finishes

        res.status(201).json(user); // sends back a 201 created status, meanign sucess
    } catch (err) {
        res.status(400).json({ error: err.message }); // if there's an error like missing fields or duplicate user it catches the error and sends back a 400 bad request status with the error message
    }
});

module.exports = router; // almost forgot about this and got an error saying that argument handler must be a function