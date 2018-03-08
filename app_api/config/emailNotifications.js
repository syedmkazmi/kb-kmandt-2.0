/**
 *  Created by syedkazmi on 04/12/2017
 */
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Proposal = mongoose.model('Proposals');
const sendinblue = require('sendinblue-api');
const parameters = {"apiKey": process.env.SEND_IN_BLUE, "timeout": 60000};
const sendinObj = new sendinblue(parameters);

let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

// =======================================================
// REMINDER EMAILS FOR PROPOSAL STATUS     ===============
// =======================================================
let proposalStatus = (req,res) => {

    Proposal.aggregate([{ $match: { $and: [ { "proposalStatus": "live" }, { "responseDate": { $lt: new Date() } } ] } },{"$group":{_id:"$ownerEmail", projects:{ $push: "$proposalTitle"}}}])
        .exec()
        .then((data) => {
            return new Promise((resolve, reject) => {
                data.map((val) => {

                    let proposals = val.projects.toString();

                    const input =	{
                        'id': 1,
                        'to': val._id,
                        'attr': {"NAME": val._id, "PLIST": proposals.replace(/,/g, '<br><br>')}
                    };

                    sendinObj.send_transactional_template(input, function(err, response){
                        if(err){
                            console.log(err);
                            reject(err);
                        } else {
                            console.log(response);
                        }
                    })
                });
            });
        })
        .then(() => {sendJsonResponse(res, 200, "done")})
        .catch(err => {sendJsonResponse(res, 500, err)})
};

// =======================================================
// REMINDER EMAILS FOR PROPOSAL SUMMARY    ===============
// =======================================================
let proposalSummary = (req,res) => {

    Proposal.aggregate([{ $match: { $and: [ { "proposalStatus": "live" }, { "responseDate": { $lt: new Date() } } ] } },{"$group":{_id: null, projects:{ $push: "$proposalTitle"}}}])
        .exec()
        .then((data) => {
                    let proposals = data.projects.toString();

                    const input =	{
                        'id': 7,
                        'to': 'syed.kazmi@kmandt.com',
                        'attr': {"PLIST": proposals.replace(/,/g, '<br><br>')}
                    };

                    sendinObj.send_transactional_template(input, function(err, response){
                        if(err){
                            console.log(err);
                        } else {
                            console.log(response);
                        }
                    })
        })
        .then(() => {sendJsonResponse(res, 200, "done")})
        .catch(err => {sendJsonResponse(res, 500, err)})
};

module.exports = {
    proposalStatus,
    proposalSummary
};