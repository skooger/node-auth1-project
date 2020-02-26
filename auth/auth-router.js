const bcrypt = require('bcryptjs');
const express = require('express');

const middleware = require('./restricted-middleware');

const db = require('./auth-model');

const router = express.Router();

router.get('/users', middleware, (req, res) => {

    db.getUsers()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({error: "Could not get users"})
        })
})


router.get('/users/:id', middleware, (req, res) => {

    db.getUserByID(req.params.id)
        .then(user => {
            if(user)
            {
                res.status(200).json(user);
            }
            else{
                res.status(404).json({error: 'No user found with that ID'})
            }
        })
        .catch(err => {
            res.status(500).json({error: "Could not get user"})
        })
})

router.post("/signup", (req, res) => {

    if (!req.body || !req.body.username || !req.body.password){ 
        res.status(400).json({error: "Username and password are both required."})
    }
    else{

        let hashedPassword = bcrypt.hashSync(req.body.password, 14);
        req.body.password = hashedPassword;

        req.session.isLoggedIn = true;
        req.session.username = req.body.username;
        console.log('Here is your session', req.session)

        db.addUser(req.body)
            .then(usersAdded => {
                res.status(200).json(usersAdded);
            })
            .catch(error => {
                res.status(500).json({error: "Could not add user."})
            })
    }
})

router.post("/login", (req, res) => {

    if (!req.body || !req.body.username || !req.body.password){ 
        res.status(400).json({error: "Username and password are both required."})
    }
    else{

        db.getUserByUsername(req.body.username)
            .then(databaseInfo => {
                if (databaseInfo && bcrypt.compareSync(req.body.password, databaseInfo.password))
                    {
                        req.session.isLoggedIn = true;
                        req.session.username = req.body.username;
                        console.log('Here is your session', req.session)
                        res.status(200).json(databaseInfo.username)
                    }
                else
                    { res.status(401).json({ error: "Invalid Credentials."})}
            })
            .catch(error => { res.status(401).json({ error: "You shall not pass."})})
    }
})

module.exports = router;