/**
 *  Created by syedkazmi on 05/06/2018
 */

const mongoose = require('mongoose');

const caseStudyCounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 5000}

});

mongoose.model('caseStudyCounter', caseStudyCounterSchema);