var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    /* Local signup registration logic */
    
    passport.use('local-signup', new localStrategy({
        usernameField:'user',
        passwordField:'pass',
        passReqToCallback:true
    }, function(req, user, password, done) {
        process.nextTick(function() {
            User.findOne({username:user}, function(err, data) {
                if (err)
                    return done(err);
                    
                /* return in case there is already an user with that username */
                if (data)
                    return done(null, false, req.flash('message', 'That user is already registered'));
                
                User.find({}, function(err, data) {
                    if (err)
                        throw err;
                    
                    var newUser = new User();
                    
                    newUser.username = user;
                    newUser.password = newUser.generateHash(password);
                    
                    if (!data.length) 
                        newUser.userLevel = 2;
                        
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                });
            });
        });
    }));
    
    /* Local login logic */
    
    passport.use('local-login', new localStrategy({
        usernameField:'user',
        passwordField:'pass',
        passReqToCallback:true
    }, function(req, user, pass, done) {
        User.findOne({username:user}, function(err, data) {
            if (err)
                return done(err);
                
            /* return in case password/username is invalid */
            if (!data || !data.validPassword(pass))
                return done(null, false, req.flash('loginErrorMessage', 'Wrong email or password'));
            
            return done(null, data);
        });
    }));
    
};