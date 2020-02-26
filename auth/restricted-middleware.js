const bcrypt = require('bcryptjs');

const db = require('./auth-model')

const authenticateUser = (req, res, next) => {

    if(!req.session || !req.session.isLoggedIn)
    {
        res.status(401).json({error: 'You are not currently logged in'})
    }
    else{
        next();
    }
}

module.exports = authenticateUser;