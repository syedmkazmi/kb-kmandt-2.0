/**
 *  Created by syedkazmi on 16/11/2017
 */

const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema({

    sectorName: {type: String},
    sectorClients: [],
    subSectors: []

});

mongoose.model('Sectors', sectorSchema);

