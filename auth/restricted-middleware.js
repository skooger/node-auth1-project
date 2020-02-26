const bcrypt = require('bcrypt');

const db = require('./auth-model')

const authenticateUser = (req, res, next) => {

    if(!req.headers || !req.headers.username || !req.headers.password)
    {
        res.status(400).json({error: 'Username and password is required!'})
    }
    else{

        db.getUserByUsername(req.headers.username)
            .then(databaseInfo => {
                if(databaseInfo && bcrypt.compareSync(req.headers.password, databaseInfo.password))
                {
                    next();
                }
                else{
                    res.status(401).json({error: "Invalid Credentials"})
                }
            })
            .catch(err => {res.status(401).json({error: 'Error loggin in!'})})
    }
}

module.exports = authenticateUser;