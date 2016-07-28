var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'),
    Book = mongoose.model('Book');

module.exports = function (app) {
  app.use('/books', router);
};    

router.get('/booklist', (req, res) =>  {
	var search = {};
	var value = req.query.value;
	var field = req.query.field;

	if(field != "" && value != ""){
		var re = new RegExp('.*'+value+'*.');
		if(field == 'name')
			search['reviews.'+field] = re;
		else 	
		  	search[field] = re;	
	}

	Book.find(search,{} , (err, data) => {
		if(!err)
			res.json(data);
		else
			res.json({
				error : err
			});
	}).sort({'title' : 1})
});

router.post('/addreview', (req, res) => {
	var review_data = {
		name	: req.body.review_name,
	  	review  : req.body.review_dsc,
	 	rate    : req.body.review_rating
	};
	var id = req.body._id;

	Book.findOne({ _id: id }, (err, book) => {
		if(err)
			res.json({
				error :  err
			});
		else if(book == null)
				res.json({
					msg : "Document not found"
				});
		else{
			book.reviews.push(review_data);
			var rating = 0;
			for(var i = 0; i < book.reviews.length; i++){
				rating += book.reviews[i].rate;
			}

			Book.update({_id: book._id},{ $set :{ average_rate : ((rating/book.reviews.length).toFixed(2))*100 }}, (err, data) => {
				if(!err)
					console.log("Rating Updated")
				else
					console.log(err);
			});

			book.save((err, data) => {
				if(!err){
					res.json({
						status : "success",
						data : data
					});
				}	
				else
					res.json({
					error: err
				});
			});
		}	
	});		

});

router.post('/addbook', (req, res) => {
	var book_data = {
		title   : req.body.book_title,
		author  : req.body.book_author,
		isbn	: req.body.book_isbn,
		price	: (parseFloat(req.body.book_price)).toFixed(2) * 100,
		average_rate	: '0'
	};

	var book = new Book(book_data);

	book.save((err, data) => {
		if(!err)
			res.json({
				status : "success",
				data : data
				});
		else
			res.json({
				error: err
		});
	});
});

router.put('/updatebook/:id', (req, res) => {
	var book_data = {
		title   : req.body.book_title,
		author  : req.body.book_author,
		isbn	: req.body.book_isbn,
		price	: (parseFloat(req.body.book_price)).toFixed(2) * 100
		//average_rate	: req.body.book_rating
	};
	var id = req.params.id;

	Book.update({ _id: id }, { $set : book_data }, (err, data) => {
		if(!err)
			res.json({
				status : "success",
				data : data
			});
		else
			res.json({
				error: err
			});
	});
});

router.delete('/deletebook/:id', (req, res) => {
	var id = req.params.id;
	Book.findOne({ _id: id }, (err, data) => {
		if(err)
			res.json({
				error :  err
			});
		else if(data == null)
			res.json({
				msg : "Document not found"
			});
		else
			Book.remove({ _id: id }, (err, data) => {
				if(err)
					res.json({
						error : err
					})
				else
					res.json({
						status : "success",
						msg : "document deleted successfully"
					});
		});

	});
});

// function updateRating(){
// 	Book.aggregate([{$group : {_id : "$_id", average_rate : {$avg : "$reviews.rate" }}}]);
// 	//db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])
// }
//module.exports = router;