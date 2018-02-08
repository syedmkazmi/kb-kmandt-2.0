const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('Users');
mongoose.Promise = Promise;

let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

// register function
let register = (req, res) => {

    if (!req.body.fullName || !req.body.email || !req.body.password) {
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

                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.email = req.body.email;
                user.password = user.generateHash(req.body.password);
                user.jobTitle = req.body.jobTitle;
                user.startDate = req.body.startDate;
                user.birthday = req.body.birthday;
                user.region = req.body.region;
                user.sector = req.body.sector;
                //user.accountConfirmationToken = token;
                //user.accountConfirmationTokenExpires = Date.now() + 3600000;

                user.save((err) => {
                    let token;

                    if (err) {
                        sendJsonResponse(res, 404, err);
                    }
                    else {
                        token = user.generateJwt();
                        sendJsonResponse(res, 200, {
                            "token": token
                        });
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

            sendJsonResponse(res, 200, {"token": token, "expiresIn": 60, "userInfo": {"firstName": user.firstName, "lastName": user.lastName, "_id": user._id}});
        } else {
            sendJsonResponse(res, 401, info);
        }
    })(req, res);
};

module.exports = {
    register,
    login
};