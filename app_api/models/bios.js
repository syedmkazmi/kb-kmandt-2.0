/**
 *  Created by syedkazmi on 06/01/2018
 */
const mongoose = require('mongoose');

const bioSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    jobTitle: String,
    userID: String,
    photo: String,
    region: String,
    lineManagerEmail: String,
    bioStatus: String,
    bioForSector: String,
    background: String,
    skills: [String],
    otherSkills: String,
    experience: {},
    approvalStage: String,
    rejectionFeedback: String,
    rejectedBy: String,
    dateCreated: {type: Date, default: Date.now},
    iconOne: String,
    iconTwo: String,
    iconThree: String,
    iconFour: String
});

mongoose.model('Bios', bioSchema);