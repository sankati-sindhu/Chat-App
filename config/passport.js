const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const passport = require('passport')
// lad user model

const User = require('../models/user');

module.exports = function(passport) {

    passport.use(
        new LocalStrategy({ usernameField: 'username'}, (username, password, done) => {
            User.findOne({username: username})
            .then(user => {
                console.log(user.password)
                if(!user) {
                    console.log('username invalid')
                    return done(null, false, {message: 'invalid username'});
                }

                //if user is there
                //match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    }else{
                        return done(null, false, { message: 'invalid password' });
                    }
                });
            })
            .catch(err => console.log(err))
        })
    );
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user) => {
            done(err, user); 
        })
    })
};
