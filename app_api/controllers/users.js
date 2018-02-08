/**
 * Created by syedkazmi on 22/08/2017.
 */
const fs = require("fs");
const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Proposal = mongoose.model('Proposals');
mongoose.Promise = Promise;

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

let upload = (req, res) => {

    let b64string = req.body;
    let bufferedData = Buffer.from(JSON.stringify(b64string), 'base64');

    User.findByIdAndUpdate(req.params.id, {
        photo: bufferedData
    }, {safe: true, new: true})
        .exec()
        .then(() => {
            sendJsonResponse(res, 200, {"message": "photo uploaded"})
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

let _proposals = (proposals) => {
    return Proposal.find({'_id': {$in: proposals}}).sort([['proposalNo', -1]]).exec();
};

module.exports = {
    getAllUsers,
    getOne,
    upload,
    userProposals
};