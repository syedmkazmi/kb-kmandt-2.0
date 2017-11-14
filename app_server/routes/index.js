const express = require('express');
const router = express.Router();
const {getHomePage: homeCtrl} = require('../controllers/main');

/* GET home page. */
router.get('/', homeCtrl);

module.exports = router;
