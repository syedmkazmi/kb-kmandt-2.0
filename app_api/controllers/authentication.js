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
                            'attr': {"TOKEN": 'http://' + req.headers.host + '/api/users/verify/' + token}
                        };

                        sendinObj.send_transactional_template(input, function (err, response) {
                            if (err) {
                                console.log(err);
                            } else {
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
        console.log("Server " + JSON.stringify(req.headers));
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

            sendJsonResponse(res, 200, {
                "token": token,
                "expiresIn": 60,
                "userInfo": {"firstName": user.firstName, "lastName": user.lastName, "_id": user._id}
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


module.exports = {
    register,
    login,
    verify
};