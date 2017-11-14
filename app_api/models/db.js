/**
 * Created by syedkazmi on 21/08/2017.
 */
const mongoose = require('mongoose');
const dbURI = 'mongodb://syed26:plzopen26@ds013848.mlab.com:13848/tokenbasedauth';
mongoose.connect(dbURI, { useMongoClient: true });

mongoose.connection.on('connected', () => {
    console.log(`Mongoose is connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
    console.log(`Mongoose encountered an error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log(`Mongoose is disconnected`);
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close( () => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});

require('./users');