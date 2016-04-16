var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var nano = require('nano')('http://localhost:5984');
//nano.db.create('books');
var books_DB = nano.db.use('books');

var app = express();



app.get('/scrape', function(req, res){

    var keyword = 'javascript';
    var url = 'http://www.amazon.com/s/?field-keywords='+keyword+'&page=1';

    //get the first page of search results on amazon based on skill
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            //console.log($.html());
            fs.writeFile('amazon_'+keyword+'.html', $.html(), function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log('File successfully written! - Check project directory for the amazon_XXX.html file');
                }
            });

            var books = [];
            for(var i=0; i<16; i++){
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
                    description: '',
                    author: author === '' ? $('#result_'+i).children().children().children().children().last().children().first().next().children().last().children().last().text() : author,
                    author_link: author_link ===  'http://www.amazon.comundefined' ? 'No author page' : author_link,
                    author_bio: 'No author bio info',
                    price: (price === '$0.00' || price === '') ? 'Kindle Edition $0.00' : price,
                    ratings: ratings === '' ? 'No Ratings' : ratings
                });
            }

            console.log(books);

            if(books[0]._id === undefined){
                console.log("Connection lost");
            }else{
                for(var j=0; j<books.length; j++){
                    books_DB.insert(books[j], function(insert_err, insert_body) {
                        if (!insert_err){
                            console.log("Book inserted into books DB: ", insert_body.id);
                            books_DB.get(insert_body.id, function(get_err, book_body) {
                                if (!get_err) {
                                    var this_book=book_body;
                                    if(this_book.author_link !== 'No author page'){
                                        request(this_book.author_link, function(error1, response1, html1){
                                            if(!error1){
                                                var $author = cheerio.load(html1);
                                                // fs.writeFile('amazon_'+this_book.author+'.html', $author.html(), function(err){
                   
                                                // });
                                                // console.log($author('#ap-bio').children().first().children().first().children().first().html());
                                                this_book.author_bio=$author('#ap-bio').children().first().children().first().children().first().html().trim();
                                                if(this_book.author_bio === ''){
                                                    this_book.author_bio = 'No author bio info'
                                                }

                                                books_DB.insert(this_book, function(update_err, update_body) {
                                                    if(!update_err){
                                                        console.log("Author Bio updated: ", update_body.id);
                                                    }else{
                                                        console.log(update_err);
                                                    }
                                                });
                                                
                                            }else{
                                                console.log(error1);
                                            }
                                        });
                                    }
                                    //Not working due to iframe
                                    // request(this_book.link, function(error1, response1, html1){
                                    //     if(!error1){
                                    //         var $book = cheerio.load(html1);
                                    //         fs.writeFile('amazon_'+this_book._id+'.html', $book.html(), function(err){
               
                                    //         });

                                    //         // var $book = cheerio.load(html1);
                                    //         // //console.log($.html());
                                    //         var description= $book('#iframeContent').contents();
                                    //         console.log(description);
                                    //         // this_book.description=description;
                                    //         // console.log(this_book);
                                    //         //update DB

                                    //     }else{
                                    //         console.log(error1);
                                    //     }
                                    // });


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

        res.send('Check your console!')
    });
});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;

