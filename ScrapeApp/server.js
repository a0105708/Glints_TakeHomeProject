var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var nano = require('nano')('http://localhost:5984');
//nano.db.create('books');
var books_DB = nano.db.use('books');

var app = express();



app.get('/scrape', function(req, res){

    //var keyword = 'couchdb';
    var keyword = req.query.skill;
    console.log("Skill entered: ", keyword);
    if(keyword){

        var url = 'http://www.amazon.com/s/?field-keywords='+keyword+'&page=1';

        //get the first page of search results on amazon based on skill
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                //console.log($.html());

                //Write the html into local file , which will only be used for reference
                fs.writeFile('amazon_'+keyword+'.html', $.html(), function(err){
                    if(err){
                        console.log(err);
                    }else{
                        //save the search result for comparison 
                        console.log('File successfully written! - Check project directory for the amazon_KEYWORD.html file');
                    }
                });


                var books = [];
                for(var i=0; i<16; i++){
                    //scrape book info
                    var id = $('#result_'+i).attr('data-asin');
                    var link = $('#result_'+i).children().children().children().children().first().children().children().children().first().attr('href');
                    var title = $('#result_'+i).children().children().children().children().last().children().first().next().children().first().children().first().text();
                    var image = $('#result_'+i).children().children().children().children().first().children().children().children().first().children().first().attr('src');
                    var author = $('#result_'+i).children().children().children().children().last().children().first().next().children().last().children().last().children().first().text();
                    var author_link = 'http://www.amazon.com'+$('#result_'+i).children().children().children().children().last().children().first().next().children().last().children().last().children().first().attr('href');
                    var price = $('#result_'+i).children().children().children().children().last().children().last().children().first().children().first().next().children().first().children().first().text();
                    var ratings = $('#result_'+i).children().children().children().children().last().children().last().children().last().children().first().children().first().children().first().children().first().children().first().children().first().text();
                    

                    books.push({
                        _id: id,
                        skill: keyword,
                        link: link,
                        title: title,
                        image: image,
                        description: 'No book description',
                        author: author === '' ? $('#result_'+i).children().children().children().children().last().children().first().next().children().last().children().last().text() : author,
                        author_link: author_link ===  'http://www.amazon.comundefined' ? 'No author page' : author_link,
                        author_bio: 'No author bio info',
                        price: (price === '$0.00' || price === '') ? 'Kindle Edition $0.00' : price,
                        ratings: ratings === '' ? 'No Ratings' : ratings
                    });
                }

                console.log(books);

                if(books[0]._id === undefined){
                    //something is wrong, maybe Amazon limits the number of connection
                    //as a result, the html we get is not in the correct format, and the book info is not at the correct place in the page
                    console.log("Connection lost");
                }else{

                    for(var j=0; j<books.length; j++){
                        //insert the book info into couchdb
                        books_DB.insert(books[j], function(insert_err, insert_body) {
                            if (!insert_err){
                                console.log("Book inserted into books DB: ", insert_body.id);
                                books_DB.get(insert_body.id, function(get_err, book_body) {
                                    if (!get_err) {
                                        var this_book=book_body;
                                        //get book description using the book link
                                        request(this_book.link, function(error1, response1, html1){
                                            if(!error1){

                                                var $book = cheerio.load(html1);
                                                // fs.writeFile('amazon_'+this_book._id+'.html', $book.html(), function(err){
                   
                                                // });
                                                var description= $book('#bookDescription_feature_div').children().first().next().html();
                                                // console.log(description);
                                                if(description === '' || description == null){
                                                    this_book.description = 'No book description';
                                                }else{
                                                    this_book.description = description.trim();
                                                }

                                                //update book db with book description 
                                                books_DB.insert(this_book, function(update_err, update_body) {
                                                    if(!update_err){
                                                        console.log("Book description updated: ", update_body.id);
                                                        
                                                        books_DB.get(update_body.id, function(get_err1, book_body1) {
                                                            if (!get_err1) {
                                                                var this_book1=book_body1;

                                                                if(this_book1.author_link !== 'No author page'){
                                                                    //get author bio using author link
                                                                    request(this_book1.author_link, function(error2, response2, html2){
                                                                        if(!error2){
                                                                            var $author = cheerio.load(html2);
                                                                            // fs.writeFile('amazon_'+this_book.author+'.html', $author.html(), function(err){

                                                                            // });
                                                                            // console.log($author('#ap-bio').children().first().children().first().children().first().html());
                                                                            this_book1.author_bio = $author('#ap-bio').children().first().children().first().children().first().html().trim();
                                                                            if(this_book1.author_bio === ''){
                                                                                this_book1.author_bio = 'No author bio info';
                                                                            }

                                                                            //update book db with author bio info
                                                                            books_DB.insert(this_book1, function(update_err1, update_body1) {
                                                                                if(!update_err1){
                                                                                    console.log("Author Bio updated: ", update_body1.id);
                                                                                }else{
                                                                                    console.log(update_err1);
                                                                                }
                                                                            });
                                                                            
                                                                        }else{
                                                                            console.log(error2);
                                                                        }
                                                                    });
                                                                }
                                                            }else{
                                                                console.log(get_err1);
                                                            }
                                                        });

                                                    }else{
                                                        console.log(update_err);
                                                    }
                                                });
                                            
                                            }else{
                                                console.log(error1);
                                            }
                                        });


                                    }else{
                                        console.log(get_err);
                                    }
                                });
                            }else{
                                console.log("Failed to insert into books DB: ", insert_err);
                            }
                        });     
                    }
                }    
               
            }else{
                console.log(error);
            }

            res.send('Please check your console!')
        });
    }else{
        res.send('Please enter skill keyword!')
    }
});



app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;

