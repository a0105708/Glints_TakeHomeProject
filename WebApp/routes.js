var db = require('./db');

module.exports = function(app,server){
	//Library.html
	app.get('/', function(req, res) {
		
		res.sendFile(__dirname + '/build/index.html');
		
	});

	app.get('/booksApp.js', function(req, res) {
		
		res.sendFile(__dirname + '/build/booksApp.js');
		
	});

	//get all books
	app.get('/api/all_books', function(req, res) {	
		db.books.getAllBooks(function(err,data){
			if(!err){
				res.json(data);
			}
		});	
	});

	app.get('/bookPage.html', function(req, res) {
		
		res.sendFile(__dirname + '/build/bookPage.html');
		
	});

	app.get('/bookPageApp.js', function(req, res) {
		
		res.sendFile(__dirname + '/build/bookPageApp.js');
		
	});

	//get one book info by ISBN (ID)
	app.get('/api/one_book', function(req, res) {
		var id = req.query.book
		if(id){
			db.books.getTheBook(id, function(err,data){
				if(!err){
					res.json(data);
				}
			});	
		}else{
			res.redirect('/');
		}
		
	});



}

