/**
 *  Created by syedkazmi on 28/12/2017
 */
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Sector = mongoose.model('Sectors');


let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

// =======================================================
// GET ALL SECTORS               =========================
// =======================================================

let get = (req, res) => {
    Sector.find()
        .exec()
        .then(data => {
            if(data){
                sendJsonResponse(res, 200, data)
            } else if(!data){
                sendJsonResponse(res, 404, {"message": "Unable to get all sectors"})
            }
        })
        .catch(err => {sendJsonResponse(res, 500, err)})

};

module.exports = {
    get
};