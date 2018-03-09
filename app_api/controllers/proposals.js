/**
 *  Created by syedkazmi on 14/11/2017
 */

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const fs = require("fs");
const rp = require('request-promise-native');
const request = require('request');
const path = require("path");
const temp_dir = path.join(process.cwd(), 'uploads');
// Mongoose Data Schemas
const Proposal = mongoose.model('Proposals');
const User = mongoose.model('Users');
const Sector = mongoose.model('Sectors');

let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

// =======================================================
// GET ALL PROPOSALS             =========================
// =======================================================
let get = (req, res) => {
    Proposal.find(req.query)
        .sort([['proposalNo', -1]])
        .exec()
        .then((data) => {
            if (data) {
                sendJsonResponse(res, 200, data)
            } else if (!data) {
                sendJsonResponse(res, 404, {"message": "Unable to get all proposals"})
            }
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// CREATE NEW PROPOSAL           =========================
// =======================================================
let create = (req, res) => {

    let newProposal = new Proposal();

    newProposal.sector = req.body.sector;
    newProposal.client = req.body.client;
    newProposal.owner = req.body.owner;
    newProposal.ownerEmail = req.body.ownerEmail;
    newProposal.proposalTitle = req.body.proposalTitle;
    newProposal.proposalRegion = req.body.proposalRegion;
    newProposal.clientContact = req.body.clientContact;
    newProposal.proposalIssueDate = req.body.proposalIssueDate;
    newProposal.responseDate = req.body.responseDate;

    newProposal.totalNumberOfDays = req.body.totalNumberOfDays;
    newProposal.dailyRate = req.body.dailyRate;
    newProposal.expenses = req.body.expenses;
    newProposal.totalValue = req.body.totalValue;

    if (req.body.proposalRegion === "UK") {
        newProposal.currency = "GBP";
    } else if (req.body.proposalRegion === "NA") {
        newProposal.currency = "CAD";
    } else if (req.body.proposalRegion === "AU") {
        newProposal.currency = "AUD";
    }

    newProposal.save()
        .then((savedProposal) => {
            return _updateUser(req.decoded._id, savedProposal)
        })
        .then(() => {
            return _checkClientExists(req.body.client)
        })
        .then((client) => {
            return _updateClientList(client, req.body)
        })
        .then(() => {
            res.json(newProposal)
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// UPDATE PROPOSAL               =========================
// =======================================================
let update = (req, res) => {

    Proposal.findByIdAndUpdate(req.params.id, {
        proposalStatus: req.body.proposalStatus.toLowerCase(),
        proposalRegion: req.body.proposalRegion,
        proposalTitle: req.body.proposalTitle.toLowerCase(),
        sector: req.body.sector.toLowerCase(),
        client: req.body.client.toLowerCase(),
        owner: req.body.owner,
        ownerEmail: req.body.ownerEmail.toLowerCase(),
        proposalIssueDate: req.body.proposalIssueDate,
        responseDate: req.body.responseDate,
        clientContact: req.body.clientContact.toLowerCase(),
        totalNumberOfDays: req.body.totalNumberOfDays,
        dailyRate: req.body.dailyRate,
        expenses: req.body.expenses,
        totalValue: req.body.totalValue,
        currency: req.body.proposalRegion === "UK" ? "GBP" : req.body.proposalRegion === "NA" ? "CAD" : "AUD"
    },{safe: true, new: true})
        .exec()
        .then(() => {
            return _checkClientExists(req.body.client)
        })
        .then((client) => {
            return _updateClientList(client, req.body)
        })
        .then(() => {
            sendJsonResponse(res, 200, {"message": "Proposal Edited"})
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// GET A SINGLE PROPOSAL         =========================
// =======================================================
let getOne = (req, res) => {
    Proposal.findById(req.params.id)
        .exec()
        .then((data) => {
            if (data) {
                sendJsonResponse(res, 200, data)
            } else if (!data) {
                sendJsonResponse(res, 404, {"message": "Unable to find a single proposal"})
            }
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// UPLOAD FILE TO DROP BOX        ========================
// =======================================================
let upload = (req, res) => {

    if (!fs.existsSync(temp_dir))
        fs.mkdirSync(temp_dir);

    let options = {
        method: 'POST',
        uri: 'https://content.dropboxapi.com/2/files/upload',
        headers: {
            'Authorization': 'Bearer ' + process.env.DROPBOX_API_TOKEN,
            'Dropbox-API-Arg': "{\"path\": \"/test/" + req.file.originalname + "\",\"mode\": \"add\",\"autorename\": true,\"mute\": false}",
            'Content-Type': 'application/octet-stream'
        }, body: fs.createReadStream(`uploads/${req.file.originalname}`, {highWaterMark: 256 * 1024})
    };

    rp(options)
        .then(() => {
            return _deleteLocalFile(req.file.originalname)
        })
        .then(() => {
            return _generateShareableLink(req.file.originalname)
        })
        .then((shareableLink) => {
            return _updateProposalFile(req.params.id, shareableLink)
        })
        .then((data) => {
            sendJsonResponse(res, 200, data)
        })
        .catch(function (err) {
            sendJsonResponse(res, 500, err)
        });

}; //TODO update promises to ES8 async/await & Move Dropbox key to env

// =======================================================
// GET FILTERED PROPOSALS         ========================
// =======================================================

/*let filter = (req, res) => {
     let query = {};

     if(req.body.proposalStatus){
         query.proposalStatus = {$elemMatch: {proposalStatus: req.body.proposalStatus}}
     }

     if(req.body.proposalRegion){
         query.propposalRegion ={$elemMatch: {proposalRegion: req.body.proposalRegion}}
     }
     console.log("QUERY " + query);

     Proposal.find(query)
         .exec()
         .then((data) => {
             if (data) {
                 console.log(data);
                 sendJsonResponse(res, 200, data)
             } else if (!data) {
                 sendJsonResponse(res, 404, {"message": "Criteria did not match any data."})
             }
         })
         .catch(err => {
             sendJsonResponse(res, 500, err)
         })


};*/

// Promises methods
let _updateUser = (userID, savedProposal) => {
    return User.findByIdAndUpdate(userID, {$push: {"usersProposals": {_id: savedProposal._id}}}, {
        safe: true,
        new: true
    }).exec();
};

let _checkClientExists = (client) => {
    return Sector.findOne({sectorClients: client.toLowerCase()}).exec();
};

let _updateClientList = (client, body) => {
    if (!client) {
        return Sector.findOneAndUpdate({sectorName: body.sector}, {$push: {sectorClients: body.client.toLowerCase()}}, {
            safe: true,
            new: true
        }).exec();
    }
};

let _updateProposalFile = (id, url) => {
    return Proposal.findOneAndUpdate({_id: id}, {proposalUrls: url}).exec();
};

let _deleteLocalFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.unlink(`uploads/${filename}`, (err) => {
            if (err) reject(err);
            console.log('successfully deleted local proposal');
            resolve();
        });
    });
};

let _generateShareableLink = (filename) => {
    return new Promise((resolve, reject) => {
        request.post('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
            headers: {
                'Authorization': 'Bearer ' + process.env.DROPBOX_API_TOKEN,
                'Content-Type': 'application/json; charset=utf-8'
            }, body: JSON.stringify({path: `/test/${filename}`, settings: {requested_visibility: "public"}})
        }, (err, httpResponse) => {
            if (err) {
                reject(err);
            } else {
                let resp = JSON.parse(httpResponse.body);

                if (resp.error && resp.error[".tag"] === "shared_link_already_exists") {

                    request.post('https://api.dropboxapi.com/2/sharing/list_shared_links', {
                        headers: {
                            'Authorization': 'Bearer ' + process.env.DROPBOX_API_TOKEN,
                            'Content-Type': 'application/json; charset=utf-8'
                        }, body: JSON.stringify({path: `/test/${filename}`, "direct_only": true})
                    }, function optionalCallback(err, httpResponse) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            resolve(JSON.parse(httpResponse.body).links[0].url)
                        }

                    })
                } else {
                    resolve(JSON.parse(httpResponse.body).url)
                }
            }
        })
    })
};


module.exports = {
    create,
    update,
    get,
    getOne,
    upload,
    //filter
};

//TODO Research about mongoose upsert true option.