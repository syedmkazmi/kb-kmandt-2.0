/**
 *  Created by syedkazmi on 10/01/2018
 */
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Icon = mongoose.model('Icons');

let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

// =======================================================
// GET ALL ICONS                 =========================
// =======================================================

let get = (req, res) => {
    Icon.find()
        .exec()
        .then(data => {
            if(data){
                sendJsonResponse(res, 200, data)
            } else if(!data){
                sendJsonResponse(res, 404, {"message": "Unable to get all icons"})
            }
        })
        .catch(err => {sendJsonResponse(res, 500, err)})

};

module.exports = {
    get
};