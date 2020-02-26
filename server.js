const express = require('express');
const helmet = require('helmet');
const cors =  require('cors');
const session = require('express-session');
const knexStore = require('connect-session-knex')(session);
const knex = require('./data/db-config');

const authRouter = require('./auth/auth-router');

const server = express();

server.use(express.json(), helmet(), cors(), session({
    name: 'user-session',
    secret: 'This is a secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    store: new knexStore({
        knex: knex,
        tablename: 'sessions',
        createtable: true,
        sidfieldname: 'session_id',
        clearInterval: 1000 * 60 * 15

    })
}))

server.use('/api/auth', authRouter);

server.get('/', (req,res) => {
    res.status(200).json({message: 'API is working.'})
})

module.exports = server;