/**
 * Created by syedkazmi on 22/08/2017.
 */

const express = require('express');
const router = express.Router();
const {getAllUsers: findUser} = require('../controllers/users');
const {create: createNew, update: updateExisting, get: getAll, getOne: getOne, upload: uploadFile, status: status} = require('../controllers/proposals');
const {register: registerUser, login: loginUser} = require('../controllers/authentication');
const jwt = require('jsonwebtoken');

// For handling file uploads using multer library
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {cb(null, 'uploads/')},
    filename: (req, file, cb) => {cb(null, file.originalname)}
});
const upload = multer({storage: storage});


// registration
router
    .route('/register')
    .post(registerUser);

// login
router
    .route('/login')
    .post(loginUser);

// middleware for token authentication
router.use((req, res, next)=>{
    let token = req.body.token || req.query.token ||req.headers['x-access-token'];

    if(token){
        //verify token by checking secret & expiry date
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
           if(err){
               if(err.name === 'TokenExpiredError'){
                   res.json(err);
                   return
               }
               return res.json({message: "Failed Authenticate Token"})
           } else {
               req.decoded = decoded;
               next();
           }
        });
    } else {
        return res
            .status(403)
            .send({message: "No Token Provided."});
    }
});

// users
router
    .route('/users')
    .get(findUser);


// proposals
router
    .route('/proposals')
    .get(getAll)
    .post(createNew);
router
    .route('/proposals/:id')
    .put(updateExisting)
    .get(getOne)
    .post(upload.single('proposal'), uploadFile); //TODO setup upload progress bar functionality. Tip: Look at  xhr.upload.addEventListener("progress")
                                                 // TODO replace POST with PATCH

module.exports = router;