/**
 * Created by syedkazmi on 22/08/2017.
 */

const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const temp_dir = path.join(process.cwd(), 'uploads');

const {associatePdfBio: associateBio} = require('../controllers/associates');
const {getAllUsers: findUser, getOne: user, upload: photo, userProposals: proposals, userBios: userbios, update: updateUser} = require('../controllers/users');
const {create: newProposal, update: updateExisting, get: getAll, getOne: getOne, upload: uploadFile} = require('../controllers/proposals');
const {create: newBio, getOne: bio, get: bios, update: existingBio, pdfBio: pdfBio} = require('../controllers/bios');
const {marketing: marketingFiles, humanResources: hrFiles, clients: clientFiles, download: file} = require('../controllers/templates');
const {register: registerUser, login: loginUser, verify: verify, resetPassword: reset, resetPasswordVerify: verifyPassword} = require('../controllers/authentication');
const {get: sectors} = require('../controllers/sectors');
const {get: skills} = require('../controllers/skills');
const {get: icons} = require('../controllers/icons');
const jwt = require('jsonwebtoken');

// For handling file uploads using multer library
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        if (!fs.existsSync(temp_dir))
            fs.mkdirSync(temp_dir);

        cb(null, 'uploads/')
    },
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
// password
router
    .route('/password/reset')
    .post(reset);
router
    .route('/password/reset/:token')
    .post(verifyPassword);
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

// associates
router
    .route('/associates/bios')
    .post(associateBio);

// users
router
    .route('/users')
    .get(findUser);
router
    .route('/users/verify/:token')
    .get(verify);
router
    .route('/users/:id')
    .get(user)
    .put(updateUser);
router
    .route('/users/:id/photo')
    .put(photo);
router
    .route('/users/:id/proposals')
    .get(proposals);
router
    .route('/users/:id/bios')
    .get(userbios);

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
    .post(newProposal);
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

// marketing
router
    .route('/templates/marketing')
    .post(marketingFiles);
router
    .route('/templates/hr')
    .post(hrFiles);
router
    .route('/templates/client')
    .post(clientFiles);
router
    .route('/templates/download')
    .post(file);

module.exports = router;