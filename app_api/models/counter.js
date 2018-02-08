/**
 *  Created by syedkazmi on 29/12/2017
 */

const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 5000}

});

 mongoose.model('Counter', counterSchema);