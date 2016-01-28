// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var favSchema = new Schema({
	cat_name: String,
	links: {
		id: Number,
		name: String,
		url: String
	}
}, {strict: false});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('Favorite', favSchema);

// make this available to our users in our Node applications
module.exports = User;
