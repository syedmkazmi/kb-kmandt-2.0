/**
 * Created by syedkazmi on 22/08/2017.
 */

const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema =  new mongoose.Schema({
    email: String,
    password: String,
    fullName: String,
    account: {
        verified: {type: String, default: 'false'}
    }
});


// generate hash for password
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// validate passwords for users
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


// generate JWT tokens for valid users
userSchema.methods.generateJwt = function () {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    //console.log("EXPIRY " + expiry.getTime()/1000);
    return jwt.sign({
       _id: this._id,
        email: this.email,
        fullName: this.fullName,
    }, process.env.JWT_SECRET, {expiresIn: 60});

};

mongoose.model('Users', userSchema);