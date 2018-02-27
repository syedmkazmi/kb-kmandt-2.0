/**
 *  Created by syedkazmi on 27/02/2018
 */

const rp = require('request-promise-native');

let sendJsonResponse = (res, status, content) => {
    res
        .status(status)
        .json(content);
};

let marketing = (req, res) => {

    let options = {
        method: 'POST',
        uri: 'https://api.dropboxapi.com/2/files/list_folder',
        headers: {
            'Authorization': 'Bearer ' + process.env.DROPBOX_API_TOKEN,
            'Content-Type': 'application/json',
        },
        body: "{\"path\": \"/kb-2.0-marketing\",\"recursive\": false,\"include_media_info\": false,\"include_deleted\": false,\"include_has_explicit_shared_members\": false,\"include_mounted_folders\": true}"
    };

    rp(options)
        .then((data) => {
            sendJsonResponse(res, 200, data)
        })
        .catch(function (err) {
            sendJsonResponse(res, 500, err)
        });

};

let humanResources = (req, res) => {

    let options = {
        method: 'POST',
        uri: 'https://api.dropboxapi.com/2/files/list_folder',
        headers: {
            'Authorization': 'Bearer ' + process.env.DROPBOX_API_TOKEN,
            'Content-Type': 'application/json',
        },
        body: "{\"path\": \"/kb-2.0-hr\",\"recursive\": false,\"include_media_info\": false,\"include_deleted\": false,\"include_has_explicit_shared_members\": false,\"include_mounted_folders\": true}"
    };

    rp(options)
        .then((data) => {
            sendJsonResponse(res, 200, data)
        })
        .catch(function (err) {
            sendJsonResponse(res, 500, err)
        });

};

let clients = (req, res) => {

    let options = {
        method: 'POST',
        uri: 'https://api.dropboxapi.com/2/files/list_folder',
        headers: {
            'Authorization': 'Bearer ' + process.env.DROPBOX_API_TOKEN,
            'Content-Type': 'application/json',
        },
        body: "{\"path\": \"/kb-2.0-clients\",\"recursive\": false,\"include_media_info\": false,\"include_deleted\": false,\"include_has_explicit_shared_members\": false,\"include_mounted_folders\": true}"
    };

    rp(options)
        .then((data) => {
            sendJsonResponse(res, 200, data)
        })
        .catch(function (err) {
            sendJsonResponse(res, 500, err)
        });

};

let download = (req, res) => {

    let options = {
        method: 'POST',
        uri: 'https://api.dropboxapi.com/2/files/get_temporary_link',
        headers: {
            'Authorization': 'Bearer ' + process.env.DROPBOX_API_TOKEN,
            'Content-Type': "application/json",
        }, body: "{\"path\": \""+ req.body.path +"\"}"
    };

    rp(options)
        .then((data) => {
            sendJsonResponse(res, 200, data)
        })
        .catch(function (err) {
            sendJsonResponse(res, 500, err)
        });
};

module.exports = {
    marketing,
    humanResources,
    clients,
    download
};