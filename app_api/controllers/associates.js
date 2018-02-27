/**
 *  Created by syedkazmi on 26/02/2018
 */

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


let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

// =======================================================
// BIO PDF                       =========================
// =======================================================

let associatePdfBio = (req, res) => {

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
                'Dropbox-API-Arg': "{\"path\": \"/kb-2.0-associate-bios/" + req.body.firstName + req.body.lastName + ".pdf" + "\",\"mode\": \"overwrite\",\"autorename\": false,\"mute\": false}",
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
            }, body: JSON.stringify({path: `/kb-2.0-associate-bios/${filename}.pdf`, settings: {requested_visibility: "public"}})
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
                        }, body: JSON.stringify({path: `/kb-2.0-associate-bios/${filename}.pdf`, "direct_only": true})
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
    associatePdfBio
};