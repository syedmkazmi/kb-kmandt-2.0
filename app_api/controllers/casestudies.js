/**
 *  Created by syedkazmi on 14/05/2018
 */

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const fs = require("fs");
const rp = require('request-promise-native');
const request = require('request');

const CaseStudy = mongoose.model('CaseStudies');
const Sector = mongoose.model('Sectors');
const User = mongoose.model('Users');

const sendinblue = require('sendinblue-api');
const parameters = {"apiKey": process.env.SEND_IN_BLUE, "timeout": 60000};
const sendinObj = new sendinblue(parameters);


let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

// =======================================================
// CREATE NEW CASE STUDY         =========================
// =======================================================

let create = (req, res) => {

    let newCaseStudy = new CaseStudy();

    newCaseStudy.firstName = req.body.firstName;
    newCaseStudy.lastName = req.body.lastName;
    newCaseStudy.lineManagerEmail = req.body.lineManagerEmail;
    newCaseStudy.region = req.body.region;
    newCaseStudy.sector = req.body.sector;
    newCaseStudy.client = req.body.client;
    newCaseStudy.proposalNo = req.body.proposalNo;
    newCaseStudy.title = req.body.title;
    newCaseStudy.background = req.body.background;
    newCaseStudy.businessCase = req.body.businessCase;
    newCaseStudy.approach = req.body.approach;
    newCaseStudy.results = req.body.results;
    newCaseStudy.userID = req.body.userID;
    newCaseStudy.skills = req.body.skills;

    newCaseStudy.save()
        .then(data => {return _findUser(data)})
        .then(user => {return _emailCaseStudyCopy(user, req.body)})
        .then(() => {return _checkClientExists(req.body.client)})
        .then((client) => {return _updateClientList(client, req.body)})
        .then(() => sendJsonResponse(res, 200, "done"))
        .catch(err => {sendJsonResponse(res, 500, err)})
};

// =======================================================
// GET ALL CASE STUDIES          =========================
// =======================================================
let get = (req, res) => {

    CaseStudy.find(req.query)
        .where('caseStudyStatus')
        .equals('approved')
        .sort([['caseStudyNo', -1]])
        .exec()
        .then((data) => {
            if (data) {
                sendJsonResponse(res, 200, data)
            } else if (!data) {
                sendJsonResponse(res, 404, {"message": "Unable to get all case studies"})
            }
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// GET ALL PENDING CASE STUDIES  =========================
// =======================================================
let getPending = (req, res) => {

    CaseStudy.find()
        .where('caseStudyStatus')
        .equals('pending')
        .sort([['caseStudyNo', -1]])
        .exec()
        .then((data) => {
            if (data) {
                sendJsonResponse(res, 200, data)
            } else if (!data) {
                sendJsonResponse(res, 404, {"message": "Unable to get all pending case studies"})
            }
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// GET ONE CASE STUDY            =========================
// =======================================================
let getOne = (req, res) => {
  CaseStudy.findById(req.params.id)
      .exec()
      .then((data) => {
          if (data) {
              sendJsonResponse(res, 200, data)
          } else if (!data) {
              sendJsonResponse(res, 404, {"message": "Unable to get one case study"})
          }
      })
      .catch(err => {
          sendJsonResponse(res, 500, err)
      })
};

// =======================================================
// UPDATE CASE STUDY             =========================
// =======================================================

let update = (req, res) => {
    CaseStudy.findByIdAndUpdate(req.params.id,{
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        lineManagerEmail: req.body.lineManagerEmail.toLowerCase(),
        region: req.body.region,
        proposalNo: req.body.proposalNo,
        sector: req.body.sector.toLowerCase(),
        client: req.body.client.toLowerCase(),
        title: req.body.title,
        background: req.body.background,
        businessCase: req.body.businessCase,
        approach: req.body.approach,
        results: req.body.results,
        caseStudyStatus: req.body.caseStudyStatus,
        skills: req.body.skills
    },{safe: true, new: true})
        .exec()
        .then(() => {
            return _checkClientExists(req.body.client)
        })
        .then((client) => {
            return _updateClientList(client, req.body)
        })
        .then(() => {
            sendJsonResponse(res, 200, {"message": "Case Study Edited"})
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// UPLOAD FILE TO DROP BOX        ========================
// =======================================================

let upload = (req, res) => {
    let options = {
        method: 'POST',
        uri: 'https://content.dropboxapi.com/2/files/upload',
        headers: {
            'Authorization': 'Bearer ' + process.env.DROPBOX_API_TOKEN,
            'Dropbox-API-Arg': "{\"path\": \"/kb-2.0-case-studies/" + req.file.originalname + "\",\"mode\": \"add\",\"autorename\": true,\"mute\": false}",
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
            return _updateCaseStudyFile(req.params.id, shareableLink)
        })
        .then((data) => {
            sendJsonResponse(res, 200, data)
        })
        .catch(function (err) {
            sendJsonResponse(res, 500, err)
        });
};

let caseStudies = (req, res) => {

    let options = {
        method: 'POST',
        uri: 'https://api.dropboxapi.com/2/files/list_folder',
        headers: {
            'Authorization': 'Bearer ' + process.env.DROPBOX_API_TOKEN,
            'Content-Type': 'application/json',
        },
        body: "{\"path\": \"/kb-2.0-case-studies\",\"recursive\": false,\"include_media_info\": false,\"include_deleted\": false,\"include_has_explicit_shared_members\": false,\"include_mounted_folders\": true}"
    };

    rp(options)
        .then((data) => {
            sendJsonResponse(res, 200, data)
        })
        .catch(function (err) {
            sendJsonResponse(res, 500, err)
        });

};

// Private Methods
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

let _updateCaseStudyFile = (id, url) => {
    return CaseStudy.findOneAndUpdate({_id: id}, {caseStudyUrls: url}).exec();
};

let _deleteLocalFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.unlink(`uploads/${filename}`, (err) => {
            if (err) reject(err);
            console.log('successfully deleted local case study');
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
            }, body: JSON.stringify({path: `/kb-2.0-case-studies/${filename}`, settings: {requested_visibility: "public"}})
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
                        }, body: JSON.stringify({path: `/kb-2.0-case-studies/${filename}`, "direct_only": true})
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

let _findUser = (casestudy) => {
    return User.findById(casestudy.userID).exec()
};

let _emailCaseStudyCopy = (user, casestudy) => {
    console.log("In side mail function");

    const input = {
        'id': 19,
        'to': user.email,
        'attr': {"USERNAME": user.firstName, "BACKGROUND": casestudy.background, "SKILLS": casestudy.skills.toString(), "BUSINESSCASE": casestudy.businessCase,
            "APPROACH": casestudy.approach,"RESULTS": casestudy.results, "TITLE": casestudy.title}
    };

    return sendinObj.send_transactional_template(input, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
            console.log("email sent");
            return response;
        }
    })
};

module.exports = {
    create,
    get,
    getPending,
    getOne,
    update,
    upload,
    caseStudies
};