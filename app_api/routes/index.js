/**
 * Created by syedkazmi on 22/08/2017.
 */

const express = require('express');
const router = express.Router();
const {getAllUsers: findUser, getOne: user, upload: photo, userProposals: proposals} = require('../controllers/users');
const {create: newProposal, update: updateExisting, get: getAll, getOne: getOne, upload: uploadFile, filter: filter , test: test} = require('../controllers/proposals');
const {create: newBio, getOne: bio, get: bios, update: existingBio, pdfBio: pdfBio} = require('../controllers/bios');
const {register: registerUser, login: loginUser} = require('../controllers/authentication');
const {get: sectors} = require('../controllers/sectors');
const {get: skills} = require('../controllers/skills');
const {get: icons} = require('../controllers/icons');
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

// sectors
router
    .route('/sectors')
    .get(sectors);

// skills
router
    .route('/skills')
    .get(skills);

// icons
router
    .route('/icons')
    .get(icons);
// users
router
    .route('/users')
    .get(findUser);
router
    .route('/users/:id')
    .get(user);
router
    .route('/users/:id/photo')
    .put(photo);
router
    .route('/users/:id/proposals')
    .get(proposals);

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



// proposals
router
    .route('/proposals')
    .get(getAll)
    //.post(newProposal);
    .post(test);
router
    .route('/proposals/:id')
    .put(updateExisting)
    .get(getOne)
    .post(upload.single('proposal'), uploadFile); //TODO setup upload progress bar functionality. Tip: Look at  xhr.upload.addEventListener("progress")
                                                // TODO replace POST with PATCH


// bios
router
    .route('/bios')
    .post(newBio)
    .get(bios);
router
    .route('/bios/:id')
    .get(bio)
    .put(existingBio);
router
    .route('/bios/:id/pdf')
    .post(pdfBio);


module.exports = router;