var express = require('express');
var router = express.Router();
var User = require('../app/models/user');

/*router.get('/userlist', function(req, res) {
 var db = req.db;
 var collection = db.get('favorites');
 collection.find({},{},function(e,docs){
 res.json(docs);
 });
 });*/

router.get('/userlist', function (req, res) {
	User.find({}).sort({_id: -1}).exec(function (e, docs) {
		res.json(docs);
	});
});

router.post('/save', function (req, res)
{
	var data = {};
	data.name = req.body.name;
	data.url = req.body.url;
	
	if(req.body.id > 0)
	{
		User.update({'_id' : req.body._id, 'links.id': req.body.id}, {'$set': {'links.$.name': req.body.name, 'links.$.url':req.body.url}}, function(err)
		{
			if(err)
			 return res.send(err);
		 
			return res.json({error: 0, msg: 'updated'});
		});
	}
	else
	{
		User.findById(req.body._id)
			.select('links')
			.exec(function(err, docs)
			{	
				var links = JSON.parse(JSON.stringify(docs.links));				
				data.id = (links.length > 0) ? (links.length + 1) : 1;

				User.findByIdAndUpdate(req.body._id, {$push: {"links": data}},
				{safe: true, upsert: true, new: true},
				function (err, model)
				{
					if (err)
						return res.send(err);

					return res.json({error: 0, msg: 'Added', id: data.id});
				});

			});
	}	
});

router.post('/deleteFav', function (req, res)
{	
	if(req.body.id > 0)
	{
		User.update({'_id' : req.body._id}, {'$pull': {'links' :{id : req.body.id}}}, function(err)
		{
			if(err)
			 return res.send(err);
		 
			return res.json({error: 0, msg: 'Deleted'});
		});
	}	
});

router.post('/saveCategory', function (req, res)
{
	var newFav = User({cat_name: req.body.name});

	newFav.save(function (err, model)
	{
		if (err)
			return res.send(err);

		return res.json(model);
	});
});

module.exports = router;
