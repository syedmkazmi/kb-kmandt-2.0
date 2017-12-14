/**
 *  Created by syedkazmi on 14/11/2017
 */

const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({

    proposalID: Number,
    url: {type: String},
    status: {type: String, default: 'live' ,set: toLower},
    sector: {type: String, set: toLower},
    client: {type: String, set: toLower},
    owner: {type: String, set: toLower},
    title: {type: String, set: toLower},
    region: {type: String, set: toLower},
    issuedOn: {type: Date},
    clientContact: {type: String, set: toLower},
    responseDate: {type: Date},

    proposalCosts: {
        totalNumberOfDays: Number,
        dailyRate: Number,
        expenses: Number,
        totalValue: Number
    },

    dateCreated: {type: Date, default: Date.now},

});

function toLower(data) {
    return data.toLowerCase();
}


mongoose.model('Proposals', proposalSchema);