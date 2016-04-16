

    var description = '';
    var author_bio = '';

    //go to the specific book page to get book description
    request($('#result_'+i).children().children().children().children().first().children().children().children().first().attr('href'), function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            //console.log($.html());
            description=$('#iframeContent').children().first().text();
            console.log($('#iframeContent').children().first().text());
            console.log(description);
             //go to the author page to get author bio
            if(author_link ===  'http://www.amazon.comundefined'){
                author_bio='No information about the author.'
            }else{
                request(author_link, function(error, response, html){
                    if(!error){
                       var $ = cheerio.load(html);
                        //console.log($.html());
                        author_bio = $('#ap-bio').children().first().children().first().children().first().children().first().text();
                        console.log($('#ap-bio').children().first().children().first().children().first().children().first().text());
                        console.log(author_bio);

                    }else{
                        console.log(error);
                    }
                });
            }

            books.push({
                id: id,
                skill: keyword,
                link: link,
                title: title,
                image: image,
                description: description,
                author: author === '' ? $('#result_'+i).children().children().children().children().last().children().first().next().children().last().children().last().text() : author,
                author_link: author_link ===  'http://www.amazon.comundefined' ? 'No author page' : author_link,
                author_bio: author_bio,
                price: (price === '$0.00' || price === '') ? 'Kindle Edition $0.00' : price,
                ratings: ratings === '' ? 'No Ratings' : ratings
            });

            console.log(books);



        }else{
            console.log(error);
        }
    });





    // console.log(books);

    // for(var j=0; j<books.length; j++){
    //     books_DB.insert({
    //         _id: books[j].id,
    //         skill:books[j].skill,
    //         link: books[j].link,
    //         title: books[j].title,
    //         image: books[j].image,
    //         description: '',
    //         author: books[j].author,
    //         author_link: books[j].author_link,
    //         author_bio: '',
    //         price: books[j].price,
    //         ratings: books[j].ratings

    //     }, function(err, body) {
    //         if (!err){
    //             console.log("Book inserted into books DB: ", body);
    //         }else{
    //             console.log("Failed to insert into books DB: ", err);
    //         }
    //     });     
    // }