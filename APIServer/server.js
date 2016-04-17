var express = require('express');
var bodyParser = require('body-parser');
var nano = require('nano')('http://localhost:5984');
var books_DB = nano.db.use('books');

var app = express();
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

var router = express.Router(); 

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/books')
    
    // get all books (accessed at GET http://localhost:8080/api/books/)
    .get(function(req, res) {
        books_DB.view('books','by_id', function(err,body){
            var books=[];
            if (!err) {
                console.log('API: Retrieved all books info from DB');
                body.rows.forEach(function(doc){        
                    books.push(doc.value);                                                        
                });
                res.json(books);
             }else{
                console.log(err);
                res.json({ error: err});
             }
        });
    })

    // create a new book (accessed at POST http://localhost:8080/api/books/ with parameters such as 
    /*
        id: (ISBN-10),
        skill: (skill, e.g. javascript, mysql, couchdb),
        link: (book url to amazon),
        title: (book title),
        image: (cover image url),
        description: (book description),
        author: (book author),
        author_link: (url to author page on amazon),
        author_bio: (description of the author),
        price: ($xx.xx),
        ratings: (customers' reviews on Amazon, e.g. 4.5 out of 5 stars)
    */
    .post(function(req, res) {
        //Compulsory fields: id
        var id = req.body.id;
        var skill = req.body.skill === undefined? 'Not specified' : req.body.skill;
        var link = req.body.link === undefined? '#' : req.body.link;
        var title =  req.body.title === undefined? 'No title' : req.body.title;
        var image = req.body.image === undefined? '#' : req.body.image;
        var description = req.body.description === undefined? 'No book description' : req.body.description;
        var author = req.body.author === undefined? 'No author' : req.body.author;
        var author_link = req.body.author_link === undefined? 'No author page' : req.body.author_link;
        var author_bio = req.body.author_bio === undefined? 'No author bio info' : req.body.author_bio;
        var price = req.body.price === undefined? 'Kindle Edition $0.00' : req.body.price;
        var ratings = req.body.ratings === undefined?  'No Ratings' : req.body.ratings;

        books_DB.insert({
            _id: id,
            skill: skill,
            link: link,
            title: title,
            image: image,
            description: description,
            author: author,
            author_link: author_link,
            author_bio: author_bio,
            price: price,
            ratings: ratings
        }, function(err, body) {
            if(!err){
                console.log('API: Created new book in DB: ', id);
                res.json({ message: 'Book successfully created!', id:id });
            }else{
                console.log(err);
                res.json({ error: err});
            }
        });      
        
    });

router.route('/books/:book_id')

    // get the book info with id (also ISBN-10 here) (accessed at GET http://localhost:8080/api/books/:book_id)
    .get(function(req, res) {
        var id = req.params.book_id;
        books_DB.get(id, function(err, body) {
            if (!err){ 
                console.log('API: Retrieved this book info from DB: ', id);
                res.json(body);
            }else{
                console.log(err);
                res.json({ error: err});
            }           
        });
    })
    // update the book info with id (also ISBN-10 here) (accessed at PUT http://localhost:8080/api/books/:book_id)
    .put(function(req, res) {
        var id = req.params.book_id;

        books_DB.get(id, function(err, body) {
            if (!err){ 
                var this_book = body;

                this_book.skill = req.body.skill === undefined? this_book.skill : req.body.skill;
                this_book.link = req.body.link === undefined? this_book.link : req.body.link;
                this_book.title =  req.body.title === undefined? this_book.title : req.body.title;
                this_book.image = req.body.image === undefined? this_book.image : req.body.image;
                this_book.description = req.body.description === undefined? this_book.description : req.body.description;
                this_book.author = req.body.author === undefined? this_book.author : req.body.author;
                this_book.author_link = req.body.author_link === undefined? this_book.author_link : req.body.author_link;
                this_book.author_bio = req.body.author_bio === undefined? this_book.author_bio : req.body.author_bio;
                this_book.price = req.body.price === undefined? this_book.price : req.body.price;
                this_book.ratings = req.body.ratings === undefined?  this_book.ratings : req.body.ratings;

                books_DB.insert(this_book, function(update_err, update_body) {
                    if(!err){
                        console.log('API: Updated this book info in DB: ', id);
                        res.json({ message: 'Book successfully updated!', id:id });
                    }else{
                        console.log(update_err);
                        res.json({ error: update_err});
                    }

                });
                
            }else{
                console.log(err);
                res.json({ error: err});
            }           
        });
    })

    // delete the book with id (also ISBN-10 here) (accessed at DELETE http://localhost:8080/api/books/:book_id)
    .delete(function(req, res) {
        var id = req.params.book_id;

        books_DB.get(id, function(err, body) {
            if (!err){ 
                var this_book = body;
                this_book._deleted = true;

                books_DB.insert(this_book, function(update_err, update_body) {
                    if(!err){
                        console.log('API: Deleted this book from DB: ', id);
                        res.json({ message: 'Book successfully deleted!', id:id });
                    }else{
                        console.log(update_err);
                        res.json({ error: update_err});
                    }

                });

            }else{
                console.log(err);
                res.json({ error: err});
            }
        });
    });


// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen('8080');

console.log('API server on port 8080');

exports = module.exports = app;

