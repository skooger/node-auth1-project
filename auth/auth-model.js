const db = require('../data/db-config');

module.exports = {
    addUser,
    getUsers,
    getUserByID,
    getUserByUsername
}

function getUsers(){
    return db('users');
}

function getUserByID(id){
    return db('users')
        .where({id})
        .first()
}

function getUserByUsername(username){
    return db('users')
        .where({username})
        .first();
}

function addUser(user){
    return db('users')
        .insert(user);
}