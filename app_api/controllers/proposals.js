/**
 *  Created by syedkazmi on 14/11/2017
 */

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const fs = require("fs");
const rp = require('request-promise-native');
const request = require('request');

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
    Proposal.find()
        .exec()
        .then((data) => {
            if(data){
                sendJsonResponse(res, 200, data)
            } else if(!data){
                sendJsonResponse(res, 404, {"message": "Unable to get all proposals"})
            }
        })
        .catch(err => {sendJsonResponse(res, 500, err)})
}; //TODO sort incoming proposals by proposal IDs

// =======================================================
// CREATE NEW PROPOSAL           =========================
// =======================================================
let create = (req, res) => {

    let newProposal = Proposal();

    newProposal.sector = req.body.sector;
    newProposal.client = req.body.client;
    newProposal.owner = req.body.owner;
    newProposal.title = req.body.title;
    newProposal.region = req.body.region;
    newProposal.clientContact = req.body.clientContact;
    //newProposal.issuedOn = req.body.issuedOn;
    //newProposal.responseDate = req.body.responseDate;

    newProposal.proposalCosts.totalNumberOfDays = req.body.totalNumberOfDays;
    newProposal.proposalCosts.dailyRate = req.body.dailyRate;
    newProposal.proposalCosts.expenses = req.body.expenses;
    newProposal.proposalCosts.totalValue = req.body.totalValue;

    newProposal.save()
        .then((savedProposal) => {return _updateUser(req.decoded._id, savedProposal)})
        .then(() => {return _checkClientExists(req.body.client)})
        .then((client) => {return _updateClientList(client, req.body)})
        .then(() => {res.json(newProposal)})
        .catch(err => {sendJsonResponse(res, 500, err)})
};

// =======================================================
// UPDATE PROPOSAL               =========================
// =======================================================
let update = (req, res) => {
    Proposal.findByIdAndUpdate(req.params.id, {
        region: req.body.region,
        title: req.body.title,
        client: req.body.client,
        owner: req.body.owner,
        clientContact: req.body.clientContact,
        proposalCosts: {
            totalNumberOfDays: req.body.totalNumberOfDays,
            dailyRate: req.body.dailyRate,
            expenses: req.body.expenses,
            totalValue: req.body.totalValue
        }
    },{safe: true, new: true})
        .exec()
        .then((data) => {
            if(data){
                sendJsonResponse(res, 200, data)
            } else if(!data){
                sendJsonResponse(res, 404, {"message": "Unable to find proposal to edit."})
            }
        })
        .catch(err => {sendJsonResponse(res,500,err)})
}; //TODO improve update method so we can update clients and sectors as well

// =======================================================
// GET A SINGLE PROPOSAL         =========================
// =======================================================
let getOne = (req, res) => {
    Proposal.findById(req.params.id)
        .exec()
        .then((data) => {
            if(data){
                sendJsonResponse(res, 200, data)
            } else if(!data){
                sendJsonResponse(res, 404, {"message": "Unable to find a single proposal"})
            }
        })
        .catch(err => {sendJsonResponse(res, 500, err)})
};

// =======================================================
// UPLOAD FILE TO DROP BOX        =========================
// =======================================================
let upload = (req,res) => {
    //GfxHmhVLefoAAAAAAAAF4-hFJZ0oZ4FtzPymFfxFVMMjFEKrBV2oBVphX_fTG-WE
    let options = {
        method: 'POST',
        uri: 'https://content.dropboxapi.com/2/files/upload',
        headers: {
            'Authorization': 'Bearer ' + process.env.DROPBOX_API_TOKEN,
            'Dropbox-API-Arg': "{\"path\": \"/test/"+req.file.originalname+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}",
            'Content-Type': 'application/octet-stream'
        },body: fs.createReadStream(`uploads/${req.file.originalname}`)
    };

    rp(options)
        .then(() => {return _deleteLocalFile(req.file.originalname)})
        .then(() => {return _generateShareableLink(req.file.originalname)})
        .then((shareableLink) => {sendJsonResponse(res, 200, shareableLink)})
        .catch(function (err) {sendJsonResponse(res, 500, err)});
}; //TODO update promises to ES8 async/await & Move Dropbox key to env

// Promises methods
let _updateUser = (userID, savedProposal) => {
    return User.findByIdAndUpdate(userID, {$push: {"usersProposals": {_id: savedProposal._id}}}, {safe: true, new: true}).exec();
};

let _checkClientExists = (client) => {
    return Sector.findOne({sectorClients: client.toLowerCase()}).exec();
};

let _updateClientList = (client,body) => {
    if (!client) {
        return Sector.findOneAndUpdate({sectorName: body.sector}, {$push: {sectorClients: body.client.toLowerCase()}}, {safe: true, new: true}).exec();
    }
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
                'Authorization': 'Bearer '+ process.env.DROPBOX_API_TOKEN,
                'Content-Type': 'application/json; charset=utf-8'
            },body: JSON.stringify({path: `/test/${filename}`, settings: {requested_visibility: "public"}})
        }, (err, httpResponse) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(httpResponse.body).url)
            }})
    })
};


module.exports = {
    create,
    update,
    get,
    getOne,
    upload
};