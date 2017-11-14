/**
 * Created by syedkazmi on 21/08/2017.
 */
const path =  require('path');
// route controller for home page
let getHomePage = (req, res) => {
    //res.render('index', { title: 'Mean Starter App' });
    res.sendFile(path.join(__dirname, 'public/index.html'))
};

module.exports = {
    getHomePage
};