/**
 *  Created by syedkazmi on 05/06/2018
 */

const mongoose = require('mongoose');
const Counter = mongoose.model('caseStudyCounter');

const caseStudySchema = new mongoose.Schema({
    caseStudyNo: Number,
    caseStudyStatus:  {type: String, default: 'pending'},
    title: String,
    background: String,
    businessCase: String,
    results: String,
    approach: String,
    sector: {type: String, set: toLower},
    client: {type: String, set: toLower},
    region: String,
    userID: String,
    firstName: String,
    lastName: String,
    lineManagerEmail: {type: String, set: toLower},
    proposalNo: String,
    rejectedBy: String,
    rejectionFeedback: String,
    approvalStage: String,
    caseStudyUrls: String,
    skills: [String],

    dateCreated: {type: Date, default: Date.now},
});

caseStudySchema.pre('save', function (next) {
    let doc = this;

    Counter.findByIdAndUpdate({_id: 'caId'},{$inc: { seq: 1}},{"upsert": true,"new": true  }, function(error, counter){
        if(error){
            return next(error);
        } else {
            doc.caseStudyNo = counter.seq;
            next();
        }
    });
});


function toLower(data) {
    return data.toLowerCase();
}

mongoose.model('CaseStudies', caseStudySchema);