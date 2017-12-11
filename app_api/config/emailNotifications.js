/**
 *  Created by syedkazmi on 04/12/2017
 */
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Proposal = mongoose.model('Proposals');
const sendinblue = require('sendinblue-api');
const parameters = {"apiKey": "kRZBVDfAGF9j5Otr", "timeout": 5000};
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
    Proposal.aggregate([{"$match": {"status": "live"}},{"$group":{_id:"$owner", projects:{ $push: "$title"}}}])
        .exec()
        .then((data) => {
            return new Promise((resolve, reject) => {
                data.map((val) => {
                    const input =	{
                        'id': 1,
                        'to': val._id,
                        'attr': {"NAME": val._id, "PLIST": val.projects.toString()}
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

module.exports = {
    proposalStatus
};