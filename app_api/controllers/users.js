/**
 * Created by syedkazmi on 22/08/2017.
 */
const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Proposal = mongoose.model('Proposals');
const Bio = mongoose.model('Bios');
mongoose.Promise = Promise;

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

// =======================================================
// GET ALL USERS                 =========================
// =======================================================
let getAllUsers = (req, res) => {
    User.find({}, 'firstName lastName email photo')
        .exec()
        .then((data) => {
            if (data) {
                return res
                    .status(200)
                    .json(data)
            }
        })
        .catch((err) => {
            return res
                .status(500)
                .json(err)
        });
};

// =======================================================
// GET A SINGLE USERS  PROPOSALS =========================
// =======================================================
let userProposals = (req, res) => {
    User.findById(req.params.id)
        .exec()
        .then((data) => {
            return _proposals(data.usersProposals)
        })
        .then((data) => {
            if (data.length >= 1) {
                sendJsonResponse(res, 200, data)
            } else if (data.length <= 0) {
                sendJsonResponse(res, 404, {"message": "You have not added any proposals yet"})
            } else if (!data) {
                sendJsonResponse(res, 404, {"message": "Unable to find user proposals"})
            }
        })
        .catch(err => {
            console.log(err);
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// GET A SINGLE USERS  BIOS      =========================
// =======================================================
let userBios = (req, res) => {
    Bio.find({'userID': req.params.id})
        .sort([['dateCreated', -1]])
        .exec()
        .then((data) => {
            if (data.length >= 1) {
                sendJsonResponse(res, 200, data)
            } else if (data.length <= 0) {
                sendJsonResponse(res, 404, {"message": "You have not added any bios yet"})
            } else if (!data) {
                sendJsonResponse(res, 404, {"message": "Unable to find user bios"})
            }
        })
        .catch(err => {
            console.log(err);
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// GET A SINGLE USER             =========================
// =======================================================

let getOne = (req, res) => {
    User.findById(req.params.id)
        .exec()
        .then((data) => {
            if (data) {
                //let base64OfPhoto = data.photo.toString('base64');
                //console.log(base64OfPhoto);
                sendJsonResponse(res, 200, data)
            } else if (!data) {
                sendJsonResponse(res, 404, {"message": "Unable to find a single user"})
            }
        })
        .catch(err => {
            console.log(err);
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// UPDATE A SINGLE USER          =========================
// =======================================================

let update = (req, res) => {

    User.findByIdAndUpdate(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        jobTitle: req.body.jobTitle,
        startDate: req.body.startDate,
        birthday: req.body.birthday,
        region: req.body.region,
        sector: req.body.sector,
        lineManagerEmail: req.body.lineManagerEmail
    }, {safe: true, new: true})
        .exec()
        .then(() => {
            sendJsonResponse(res, 200, {"message": "user updated"})
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

let upload = (req, res) => {
    // console.log(JSON.stringify(b64string));
    //let bufferedData = Buffer.from(JSON.stringify(b64string), 'base64');
    cloudinary.v2.uploader.upload(req.body.photo, {public_id: req.body.name, quality: "auto:low"}, function (error, result) {
        console.log(result);
        User.findByIdAndUpdate(req.params.id, {
            photo: result["secure_url"]
        }, {safe: true, new: true})
            .exec()
            .then((data) => {
                sendJsonResponse(res, 200, data.photo)
            })
            .catch(err => {
                sendJsonResponse(res, 500, err)
            })
    });

};

let _proposals = (proposals) => {
    return Proposal.find({'_id': {$in: proposals}}).sort([['proposalNo', -1]]).exec();
};

module.exports = {
    getAllUsers,
    getOne,
    update,
    upload,
    userProposals,
    userBios
};