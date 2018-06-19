/**
 *  Created by syedkazmi on 06/01/2018
 */
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const fs = require("fs");
const rp = require('request-promise-native');
const request = require('request');
const path = require("path");
const temp_dir = path.join(process.cwd(), 'bios_pdf');
const pdf = require('html-pdf');
const ejs = require('ejs');
let html = fs.readFileSync('./app_server/pdf-templates/pdf-bio-template.ejs', 'utf8');
const base = path.resolve("./angular-src/src");
const options = {format: 'A4', timeout: 50000, base: `file://${base}`, border: "40px"};

const sendinblue = require('sendinblue-api');
const parameters = {"apiKey": process.env.SEND_IN_BLUE, "timeout": 60000};
const sendinObj = new sendinblue(parameters);

// Mongoose Data Schemas
const Bio = mongoose.model('Bios');
const User = mongoose.model('Users');

let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

// =======================================================
// GET ALL BIOS                  =========================
// =======================================================
let get = (req, res) => {
    Bio.find(req.query)
        .sort([['dateCreated', -1]])
        .exec()
        .then((data) => {
            if (data) {
                sendJsonResponse(res, 200, data)
            } else if (!data) {
                sendJsonResponse(res, 404, {"message": "Unable to get all bios"})
            }
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// CREATE NEW BIO                =========================
// =======================================================
let create = (req, res) => {

    //let b64string = req.body.photo;
    //let bufferedData = Buffer.from(JSON.stringify(b64string), 'base64');

    let newBio = new Bio();

    newBio.firstName = req.body.firstName;
    newBio.lastName = req.body.lastName;
    newBio.jobTitle = req.body.jobTitle;
    newBio.userID = req.decoded._id;
    newBio.photo = req.body.photo;
    newBio.lineManagerEmail = req.decoded.lineManagerEmail;
    newBio.region = req.body.region;
    newBio.bioStatus = "pending";
    newBio.background = req.body.background;
    newBio.experience = req.body.experience;
    newBio.skills = req.body.skills;
    newBio.iconOne = req.body.iconOne;
    newBio.iconTwo = req.body.iconTwo;
    newBio.iconThree = req.body.iconThree;
    newBio.iconFour = req.body.iconFour;
    //newBio.otherSkills = req.body.otherSkills;
    newBio.bioForSector = req.body.bioForSector;
    //newBio.approvalStage = "Line Manager";

    newBio.save()
        .then(data => {return _findUser(data)})
        .then(user => {return _emailBioCopy(user, req.body)})
        .then(() => sendJsonResponse(res, 200, "done"))
        .catch(err => {sendJsonResponse(res, 500, err)})
};

// =======================================================
// GET A SINGLE BIO              =========================
// =======================================================
let getOne = (req, res) => {
    Bio.findById(req.params.id)
        .lean()
        .exec()
        .then((data) => {
            if (data) {

                return data;
                /*if (data.photo != null) {
                    data.photo = data.photo.toString('base64');
                    return data;
                } else {
                    return data;
                }*/
            } else if (!data) {
                sendJsonResponse(res, 404, {"message": "Unable to find a single bio"})
            }
        })
        .then((data) => {
            sendJsonResponse(res, 200, data)
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// UPDATE A BIO                  =========================
// =======================================================
let update = (req, res) => {
    //let b64string = req.body.photo;
    //let bufferedData = Buffer.from(JSON.stringify(b64string), 'base64');

    Bio.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            lineManagerEmail: req.decoded.lineManagerEmail,
            region: req.body.region,
            photo: req.body.photo,
            background: req.body.background,
            experience: req.body.experience,
            skills: req.body.skills,
            iconOne: req.body.iconOne,
            iconTwo: req.body.iconTwo,
            iconThree: req.body.iconThree,
            iconFour: req.body.iconFour,
            bioForSector: req.body.bioForSector,
            dateCreated: Date.now()
        },
        {safe: true, new: true}
    )
        .exec()
        .then((data) => {
            if (data) {
                sendJsonResponse(res, 200, data)
            } else if (!data) {
                sendJsonResponse(res, 404, {"message": "Unable to find bio to edit."})
            }
        })
        .catch(err => {
            sendJsonResponse(res, 500, err)
        })
};

// =======================================================
// BIO PDF                       =========================
// =======================================================

let pdfBio = (req, res) => {

    ejs.renderFile('./app_server/pdf-templates/pdf-bio-template.ejs', {
        photo: req.body.photo,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        jobTitle: req.body.jobTitle,
        iconOne: req.body.iconOne,
        iconTwo: req.body.iconTwo,
        iconThree: req.body.iconThree,
        iconFour: req.body.iconFour,
        background: req.body.background,
        exp1: req.body.experience.field0,
        exp2: req.body.experience.field1,
        exp3: req.body.experience.field2,
        exp4: req.body.experience.field3,
        exp5: req.body.experience.field4,
        exp6: req.body.experience.field5,
        skills: req.body.skills
    }, function (err, result) {
        // render on success
        if (result) {
            html = result;
            console.log(req.body.background);
        } else {
            console.log(err);
        }
    });

    pdf.create(html, options).toFile(`./bios_pdf/${req.body.firstName + req.body.lastName}.pdf`, function (err, resp) {
        if (err)
            return sendJsonResponse(res, 500, err);

        if (!fs.existsSync(temp_dir))
            fs.mkdirSync(temp_dir);
            let filename = req.body.firstName + req.body.lastName;

            let options = {
                method: 'POST',
                uri: 'https://content.dropboxapi.com/2/files/upload',
                headers: {
                    'Authorization': 'Bearer ' + process.env.DROPBOX_API_TOKEN,
                    'Dropbox-API-Arg': "{\"path\": \"/kb-2.0-bios/" + req.body.firstName + req.body.lastName + ".pdf" + "\",\"mode\": \"overwrite\",\"autorename\": false,\"mute\": false}",
                    'Content-Type': 'application/octet-stream'
                }, body: fs.createReadStream(`${temp_dir}/${filename}.pdf`)
            };

            rp(options)
                .then(() => {
                    return _deleteLocalFile(filename)
                })
                .then(() => {
                    return _generateShareableLink(filename)
                })
                .then((shareableLink) => {
                    sendJsonResponse(res, 200, shareableLink)
                })
                .catch(function (err) {
                    sendJsonResponse(res, 500, err)
                });

    });
};

// =======================================================
// PRIVATE FUNCTIONS             =========================
// =======================================================

let _deleteLocalFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.unlink(`${temp_dir}/${filename}.pdf`, (err) => {
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
            }, body: JSON.stringify({path: `/kb-2.0-bios/${filename}.pdf`, settings: {requested_visibility: "public"}})
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
                        }, body: JSON.stringify({path: `/kb-2.0-bios/${filename}.pdf`, "direct_only": true})
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

let _findUser = (bio) => {
   return User.findById(bio.userID).exec()
};

let _emailBioCopy = (user, bio) => {
    console.log("In side mail function");

    const input = {
        'id': 6,
        'to': user.email,
        'attr': {"USERNAME": user.firstName, "BACKGROUND": bio.background, "SKILLS": bio.skills.toString(), "EXPERIENCE0": bio.experience.field0,
            "EXPERIENCE1": bio.experience.field1,"EXPERIENCE2": bio.experience.field2, "EXPERIENCE3": bio.experience.field3,
            "EXPERIENCE4": bio.experience.field4, "EXPERIENCE5": bio.experience.field5}
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
    get,
    create,
    getOne,
    update,
    pdfBio
};