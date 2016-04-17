var nano = require('nano')('http://localhost:5984');
var books_DB    = nano.use('books');


//get all books
exports.getAllBooks = function(cb) {
	books_DB.view('books','by_id', function(err,body){
		var books=[];
		 if (!err) {
		 	console.log('Retrieved all books info from DB');
		 	body.rows.forEach(function(doc){		
				books.push({id:doc.value._id, author:doc.value.author, image:doc.value.image, price:doc.value.price, ratings:doc.value.ratings, skill:doc.value.skill, title: doc.value.title});			                			                
			});
		    return cb(null, books);
		 }else{
		  	console.log(err);
		  	return cb(err, null);
		 }
	});
}

//get book by ISBN (ID)
exports.getTheBook = function(id, cb) {
	books_DB.get(id, function(err, body) {
		if (!err){ 
			console.log('Retrieved this book info from DB: ', id);
			return cb(null, body);
		}else{
			console.log(err);
			return cb(err, null);
		}			
	});
}



