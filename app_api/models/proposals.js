/**
 *  Created by syedkazmi on 14/11/2017
 */

const mongoose = require('mongoose');
const Counter = mongoose.model('Counter');

const proposalSchema = new mongoose.Schema({

    proposalNo: Number,
    proposalUrls: {type: String, default: 'none'},
    proposalStatus: {type: String, default: 'live' ,set: toLower},
    sector: {type: String, set: toLower},
    client: {type: String, set: toLower},
    owner: String,
    ownerEmail: {type: String, set: toLower},
    proposalTitle: {type: String, set: toLower},
    proposalRegion: String,
    proposalIssueDate: {type: Date},
    clientContact: {type: String, set: toLower},
    responseDate: {type: Date},

    currency: String,
    totalNumberOfDays: Number,
    dailyRate: Number,
    expenses: Number,
    totalValue: Number,

    dateCreated: {type: Date, default: Date.now},

});

proposalSchema.pre('save', function (next) {
    let doc = this;

    Counter.findByIdAndUpdate({_id: 'entityId'},{$inc: { seq: 1}},{"upsert": true,"new": true  }, function(error, counter){
        if(error){
            return next(error);
        } else {
            doc.proposalNo = counter.seq;
            next();
        }
    });
});


function toLower(data) {
    return data.toLowerCase();
}



mongoose.model('Proposals', proposalSchema);