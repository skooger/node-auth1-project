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


router.get('/users/:id', (req, res) => {

    db.getUserByID(req.params.id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({error: "Could not get user"})
        })
})

router.post('/signup', (req, res) => {

    if(!req.body || !req.body || !req.body.password)
    {
        res.status(400).json({error: 'Username and password is required!'})
    }
    else{

        let hashedPassword = bcrypt.compare(req.body.password, 14);
        req.body.password = hashedPassword;

        db.addUser(req.body)
            .then(addedUser => {
                res.status(200).json(addedUser)
            })
            .catch(err => {
                res.status(500).json({error: "Could not add user"})
            })
    }

})


module.exports = router;