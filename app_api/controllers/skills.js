/**
 *  Created by syedkazmi on 08/01/2018
 */
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Skill = mongoose.model('Skills');

let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

// =======================================================
// GET ALL SKILLS               =========================
// =======================================================

let get = (req, res) => {
    Skill.find()
        .exec()
        .then(data => {
            if(data){
                sendJsonResponse(res, 200, data)
            } else if(!data){
                sendJsonResponse(res, 404, {"message": "Unable to get all skills"})
            }
        })
        .catch(err => {sendJsonResponse(res, 500, err)})

};

module.exports = {
    get
};