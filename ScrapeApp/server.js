var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var app     = express();


app.get('/scrape', function(req, res){

    var keyword = 'couchdb';
    var url = 'http://www.amazon.com/s/?field-keywords='+keyword+'&page=1';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            //console.log($.html());
            fs.writeFile('amazon.html', $.html(), function(err){

                console.log('File successfully written! - Check your project directory for the amazon.html file');

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
                    id: id,
                    skill: keyword,
                    link: link,
                    title: title,
                    image: image,
                    author: author === '' ? $('#result_'+i).children().children().children().children().last().children().first().next().children().last().children().last().text() : author,
                    author_link: author_link ===  'http://www.amazon.comundefined' ? 'No author page' : author_link,
                    price: (price === '$0.00' || price === '') ? 'Kindle Edition $0.00' : price,
                    ratings: ratings === '' ? 'No Ratings' : ratings
                })
            }

            console.log(books);
           
        }else{
            console.log(error);
        }

        res.send('Check your console!')
    });
});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;

