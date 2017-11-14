/**
 * Created by syedkazmi on 22/08/2017.
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('Users');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, function (email, password, done) {
        User.findOne({'email': email}, (err, user) => {
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, {message: `No User Account Exists for ${email}`});
            }
            if(!user.validPassword(password)){
                return done(null, false, {message: 'Incorrect Password.'});
            }
            if(user.account.verified === 'false'){
                return done(null, false, {message: 'Looks like your accounts not verified'});
            }
            return done(null, user)
        });
    }
));