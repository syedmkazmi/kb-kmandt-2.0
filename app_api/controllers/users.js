/**
 * Created by syedkazmi on 22/08/2017.
 */

const mongoose = require('mongoose');
const User = mongoose.model('Users');
mongoose.Promise = Promise;

let getAllUsers = (req,res) => {
  User.find()
      .exec()
      .then((data)=>{
        if(data) {
            return res
                .status(200)
                .json(data)
        }
      })
      .catch((err)=>{
        return res
            .status(500)
            .json(err)
     });
  //console.log(`${req.body.fullName}`);
};

module.exports = {
    getAllUsers
};