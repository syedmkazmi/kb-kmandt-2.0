/**
 *  Created by syedkazmi on 08/01/2018
 */
const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
    allSkills: [String]
});

mongoose.model('Skills', skillsSchema);