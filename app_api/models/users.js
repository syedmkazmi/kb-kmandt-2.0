/**
 * Created by syedkazmi on 22/08/2017.
 */

const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({

    firstName: String,
    lastName: String,
    email: {type: String, set: toLower},
    password: String,
    jobTitle: String,
    photo: String,
    startDate: {type: Date},
    birthday: {type: Date},
    lastLogin: {type: Date}, //TODO: Set last login date on login

    region: String,
    sector: String,

    usersProposals: [],
    isLineManager: {type: String, default: 'false'},
    lineManagerEmail: {type: String, set: toLower},
    accessLevel: [],

    biosPending: [String],
    biosApproved: [{bioID: String, date: {type: Date, default: Date.now}}],

    caseStudyPending: [String],

    resetPasswordToken: String,
    resetPasswordDate: Date,

    accountConfirmationToken: String,
    accountConfirmationTokenExpires: Date,
    accountVerified: {type: String, default: 'false'}
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
        firstName: this.firstName,
        lastName: this.lastName,
        region: this.region,
        jobTitle: this.jobTitle,
        lineManagerEmail: this.lineManagerEmail
    }, process.env.JWT_SECRET, {expiresIn: '168h'});
};

function toLower(data) {
    return data.toLowerCase();
}


mongoose.model('Users', userSchema);