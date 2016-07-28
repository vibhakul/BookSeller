var db = require('mongoose'),
  Schema = db.Schema;

var reviewSchema = new Schema({
	name	: { type : String },
	review  : { type : String },
	rate    : { type : Number},
	date	: { type : Date, default: Date.now }
});	

var bookSchema = new Schema({
	title   : { type: String, required: true },
	author  : { type: String },
	isbn	: { type: String, unique : true, required: true },
	price	: {	type: Number },
	reviews : [ reviewSchema ],
	average_rate	: { type: Number}
});

module.exports = db.model('Book', bookSchema);


