var express = require('express');
var router = express.Router();
var User = require("../models/user");

// get homepage
router.get('/', function(req, res){
	res.render('index');
});
// make sure logged in
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}


module.exports = router;

