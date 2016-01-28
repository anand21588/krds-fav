var express = require('express');
var User = require('../app/models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    User.find({}).exec(function(e,docs)
    {
	res.render('index', { title: 'KRDS Fav', data: JSON.stringify(docs) });
    });
});

module.exports = router;
