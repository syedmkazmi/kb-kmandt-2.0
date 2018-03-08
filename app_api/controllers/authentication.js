const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('Users');
mongoose.Promise = Promise;
const crypto = require('crypto');

const sendinblue = require('sendinblue-api');
const parameters = {"apiKey": process.env.SEND_IN_BLUE, "timeout": 5000};
const sendinObj = new sendinblue(parameters);

let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

// register function
let register = (req, res) => {

    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
        sendJsonResponse(res, 400, {"message": "All fields required"});
        return;
    }

    User.findOne({email: req.body.email})
        .exec()
        .then((user) => {
            if (user) {
                sendJsonResponse(res, 400, {"message": "User Already Registered"});
            } else if (!user) {

                let user = new User();
                let token = crypto.randomBytes(20).toString('hex');

                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.email = req.body.email;
                user.password = user.generateHash(req.body.password);
                //user.jobTitle = req.body.jobTitle;
                // user.startDate = req.body.startDate;
                //user.birthday = req.body.birthday;
                //user.region = req.body.region;
                //user.sector = req.body.sector;
                user.accountConfirmationToken = token;
                user.accountConfirmationTokenExpires = Date.now() + 3600000;

                user.save((err) => {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    }
                    else {
                        const input = {
                            'id': 2,
                            'to': req.body.email,
                            'attr': {"TOKEN": req.headers.host + '/api/users/verify/' + token}
                        };

                        sendinObj.send_transactional_template(input, function (err, response) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(response);
                                sendJsonResponse(res, 200, {"message": "Great! You have successfully registered."})
                            }
                        })
                    }
                });
            }
        })
        .catch((err) => {
            return res
                .status(500)
                .json(err)
        });
};

// login function
let login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        sendJsonResponse(res, 400, {"message": "All fields required"});
        return;
    }

    passport.authenticate('local', (err, user, info) => {
        let token;

        if (err) {
            sendJsonResponse(res, 404, err);
            return;
        }

        if (user) {
            token = user.generateJwt();
            // Below code does not work
            //let base64data= JSON.stringify(user.photo).toString('base64');
            // let x = encodeURIComponent(base64data);
            let registration = false;

            if(user.jobTitle == null || user.sector == null || user.region == null || user.startDate == null || user.birthday == null || user.lineManagerEmail ==  null){
                registration = true;
            }

            sendJsonResponse(res, 200, {
                "token": token,
                "expiresIn": 60,
                "userInfo": {"_id": user._id, "firstName": user.firstName, "lastName": user.lastName},
                "profileImg": user.photo || "",
                "registration": registration
            });
        } else {
            sendJsonResponse(res, 401, info);
        }
    })(req, res);
};

// verify user
let verify = (req, res) => {
    User.findOne({accountConfirmationToken: req.params.token})
        .exec()
        .then((user) => {
            if (!user) {
                sendJsonResponse(res, 401, {message: "Token is invalid or has expired"})
            } else {
                user.accountVerified = true;
                user.accountConfirmationToken = null;
                user.accountConfirmationTokenExpires = null;

                user.save(() => {
                    sendJsonResponse(res, 200, "Account Verified")
                })
            }
        })
        .catch((err) => {
            sendJsonResponse(res, 500, err)
        })
};

// password reset
let resetPassword = (req, res) => {
    let token = crypto.randomBytes(20).toString('hex');

    User.findOne({email: req.body.email})
        .exec()
        .then((user) => {
            if(user) {
                user.resetPasswordToken = token;
                user.resetPasswordDate = Date.now();

                user.save((err) => {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    }
                    else {
                        const input = {
                            'id': 8,
                            'to': req.body.email,
                            'attr': {"TOKEN": req.headers.host + '/#/password/reset/' + token}
                        };

                        sendinObj.send_transactional_template(input, function (err, response) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(response);
                                sendJsonResponse(res, 200, {"message": "Great! You have successfully reset your password."})
                            }
                        })
                    }
                })
            }
            else if(!user) {
                sendJsonResponse(res, 404, {message: `No User Account Exists for ${req.body.email}`})
            }
        })
        .catch((err) => {
            return res
                .status(500)
                .json(err)
        });
};

// verify reset password
let resetPasswordVerify = (req, res) => {
    User.findOne({resetPasswordToken: req.params.token})
        .exec()
        .then((user) => {
            if (!user) {
                sendJsonResponse(res, 401, {message: "Token is invalid or has expired"})
            } else {
                user.password = user.generateHash(req.body.password);
                user.resetPasswordToken = null;
                user.resetPasswordDate = null;

                user.save((err) => {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        const input = {
                            'id': 9,
                            'to': user.email
                        };

                        sendinObj.send_transactional_template(input, function (err, response) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(response);
                                sendJsonResponse(res, 200, {"message": "Great! You have successfully verified your password reset."})
                            }
                        })
                    }

                })
            }
        })
        .catch((err) => {
            sendJsonResponse(res, 500, err)
        })
};


module.exports = {
    register,
    login,
    verify,
    resetPassword,
    resetPasswordVerify
};