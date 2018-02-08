/**
 *  Created by syedkazmi on 10/01/2018
 */
const mongoose = require('mongoose');

const iconsSchema = new mongoose.Schema({
    url: [String]
});

mongoose.model('Icons', iconsSchema);