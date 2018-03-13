require('dotenv').load();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const CronJob = require('cron').CronJob;

require('./app_api/models/db');
require('./app_api/config/passport');

const mail = require('./app_api/config/emailNotifications');
const index = require('./app_server/routes/index');
const apiRoutes = require('./app_api/routes/index');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server','views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(requireHTTPS);

app.use(passport.initialize());

app.use('/', index);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}


// CRON JOBS
let job1 = new CronJob('00 00 07 * * 5', function() {
    // Execute code here
    console.log("Starting first cron job");
    mail.proposalStatus();
}, null, true, 'Europe/London');

job1.start();
console.log("Cron Job 1 " + job1.running);

let job2 = new CronJob('00 01 07 * * 5', function() {
    // Execute code here
    console.log("Starting second cron job");
    mail.proposalSummary();
}, null, true, 'Europe/London');

job2.start();
console.log("Cron Job 2 " + job2.running);

module.exports = app;
