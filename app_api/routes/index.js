/**
 * Created by syedkazmi on 22/08/2017.
 */

const express = require('express');
const router = express.Router();
const {getAllUsers: findUser} = require('../controllers/users');
const {register: registerUser, login: loginUser} = require('../controllers/authentication');
const jwt = require('jsonwebtoken');

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
    .get(findUser);

module.exports = router;