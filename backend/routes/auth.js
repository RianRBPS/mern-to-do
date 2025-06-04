const express = require('express'); // imports the express framework, which simplifies building web services in Node.js
const router = express.Router(); // creates a new router object using express, allowing you to group route handlers together and export them. this keeps the code modular
const User = require('../models/User'); // imports the User model from a mongoose schema to interact with the "users" collection in the mongodb database
const bcrypt = require('bcrypt'); // imports bcrypt, a library for hashing passwords securely using salting and multiple hashing rounds
const jwt = require('jsonwebtoken'); // imports jsonwebtoken, used to create and verify JWT for authentication

function generateAccessToken(user) { // defines a helper function that generates a jwt token 
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1800s' })  
    // jwt.sign is a function from jsonwebtoken that creates (signs) a JWT, this token can be later send to the client and used for authentication to prove the user's identity
    // syntax: jwt.sign(payload, secretOrPrivacy, [options])
    // payload { userId: "123" } it's encoded into the token and can be decoded later (don't put sensitive data here, it's only base64-encoded, not encrypted)
    // secretOrPrivacy it's a secret string used to sign in the token, it ensures that the token is authentic (was issued by the server) and it hasn't been tampered with (modifying will make it invalid)
    // [options] (optional) an object to configure the token, like expiresIn, issuer, subject etc
    // expiresIn: makes the token valid for 1800s (30 minutes)
}

router.post('/register', async (req, res) => { // defines a POST route at /register to handle user registration, async allows me to use await to handle asynchronous operations like saving to database
    const { name, password } = req.body; // extracts name and password from the body of the incoming request, these should be sent as a JSON by the client
    try {
        const saltRounds = 10; // saltRounds define how many times bcrypt will process the password for salting, higher = more secure but slower
        const hashedPassword = await bcrypt.hash(password, saltRounds); // hashes the plain text password with the defined number of salt rounds
        const user = await User.create({ name, password: hashedPassword}); // creates and stores a new user in the mongoDB database, saving the hashed password instead of the raw one
        const token = generateAccessToken( { userId: user._id }); // generates a JWT for the newly created user, storing their mongoDB _id as a claim (a simple piece of information stored inside the token's payload, claims are key valued pairs) in the token
        // there are two types of claims, standart (defined by JWT like iat, exp, sub, iss) and custom (anything you define like userId, role), storing a claim just means adding a piece of data into the tokens payload

        res.status(201).json({ user, token }); // sends a 201 created response with the new user object and the acess token
    } catch (err) {
        res.status(400).json({ error: err.message }); // if there's an error like missing fields or duplicate user it catches the error and sends back a 400 bad request status with the error message
    }
});

router.post('/login', async (req, res) => { // defines a POST route at /login to handle user login, async allows me to use await to wait for asynchronous operations
    const {name, password} = req.body;  // extracts name and password from the request body send as JSON by the client
    try{
        const user = await User.findOne({ name }); // looks up the the user by name in the mongoDB collection, returns null if not found
        if (!user) { return res.status(401).json({ error: 'invalid credentials'});} // if no matching user is found, return a 401 unauthorized with a generic error message
        const isMatch = await bcrypt.compare(password, user.password); // compares the raw password (password) from the request with the hashed password (user.password) stored in the database. 
        // bycript will hash the raw password with the same salt and algorithm as the one stored in the database (user.password) and then compare the two hashes, if the match return true, else return false
        if (!isMatch) { return res.status(401).json({ error: 'invalid credentials '});} // if the password doesn't match, return another 401 unauthorized 
        const token = generateAccessToken({ userId: user._id }) // if the password is valid, generate a new JWT for this user using the user._id as the payload
        // user._id this is mongodb unique identifier for the user, when a document is saved to mongodb using mongoose, it automatically gets and _id field like:
        // _id: "664a2e6b1d1e883af8a2f55e"
        /*
            { userId: user._id } creates a new javascript object, with the name usedId instead of _id to avoid exponsing internal DB structure to the frontend:

            {
                userId: "664a2e6b1d1e883af8a2f55e"
            }

            once this passes to generateAccessToken, generating a payload (second part of JWT) like this:

            {
                "userId": "664a2e6b1d1e883af8a2f55e",
                "iat": 1717550000,
                "exp": 1717551800
            }

            then it will generate a JWT with this structure: <HEADER>.<PAYLOAD>.<SIGNATURE>
            the JWT will be a string like this:
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjRhMmU2YjFkMWU4ODNhZjhhMmY1NWUiLCJpYXQiOjE3MTc1NTAwMDAsImV4cCI6MTcxNzU1MTgwMH0.4v9tvG_jnNUuhE5dEHzX1Jpb0Ay8dMTZmrCoTXEj_qg
        */
        res.status(200).json({ message: 'login successful', token, user}); // sends a 200 OK response with a sucess message, the token, and the user object
    } catch (err) {
        res.status(400).json({ error: err.message }) // if something unexpected happens, returns 400 Bad Request with the error message
    }
});

module.exports = router; // exports the router so that it can be imported and used in the main server file (app.js or index.js) like: app.use('/api', require('.routes/auth.js'));