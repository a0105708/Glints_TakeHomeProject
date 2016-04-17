# Glints_TakeHomeProject
Glints Take-home Project - Wang Tianqi


DB Configuration:
Please install couchDB first, and then create a database named 'books', next create a new design document with the code provided below:

{
   "_id": "_design/books",
   "views": {
       
     	"by_id": {
           "map": "function (doc) {\n\t\t  emit(doc._id, doc);\n\t\t}"
       },
       "by_title": {
           "map": "function (doc) {\n\t\t  emit(doc.title, doc);\n\t\t}"
       },
       "by_author": {
           "map": "function (doc) {\n\t\t  emit(doc.author, doc);\n\t\t}"
       },
       "by_skill": {
           "map": "function (doc) {\n\t\t  emit(doc.skill, doc);\n\t\t}"
       },
       "by_price": {
           "map": "function (doc) {\n\t\t  emit(doc.price, doc);\n\t\t}"
       },
       "by_ratings": {
           "map": "function (doc) {\n\t\t  emit(doc.ratings, doc);\n\t\t}"
       }
   }
}

DB schema is as follows:

{
	_id: (ISBN-10),
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
}


The default url for db connection should be http://localhost:5984/


1. To start ScrapeApp

Using command line to redirect to the folder, and then npm install necessary dependencies.

Enter command "npm start" to start the server, and now please go to browser and enter http://localhost:8081/scrape?skill=XXXXX,

where XXXXX is the skill that you want to find books about. For example: http://localhost:8081/scrape?skill=javascript

Then please check the server console to confirm data is successfully stored into couchdb.

If there is 'Connection Lost' displayed in the console, please try enter the skill keyword again. 



2. To start WebApp

Using command line to redirect to the folder, and then npm install all necessary dependencies.

Now npm start to start the server. Next please go to your browser with link http://localhost:3000/ .

You should be able to view all books scraped before and stored in the db.

There are filters available on the left side navbar such as "View All Books", "By Skill", "By Author", "By Price Range", "By Ratings".

After clicking on one of the filters, you will be able to view the search results, and you can sort the results by options on the righ side,

such as "By Title (A-Z)", "By Price (Low - High)", "By Ratings (High - Low)".

You can mouse over on the cover image of each book, then you will see the details of the book.

There's a book icon on the hover text, so you can click on it to go to the book page with more info,

like book description, author bio, book link to Amazon, author page to Amazon, etc.



3. To start APIServer

Using command line to redirect to the folder, and then npm install necessary dependencies.

Enter command "npm start" to start the server. 

The basic routes needed for our API are shown below, including all actions of GET, POST, PUT, and DELETE.

API link is as follows: http://localhost:8080/api/books/

Route:					HTTP Verb:		Description:

/api/books				(GET)				Get all books.

/api/books				(POST)				Create a book.

/api/books/:book_id		(GET)				Get a single book.

/api/bears/:book_id		(PUT)				Update a book with new info.

/api/bears/:book_id		(DELETE)			Delete a book.

Please try to enter correct parameters as specified in the server.js file in APIServer folder, although I tried to cover most validation cases

Please feel free to contact me if you have any problem setting up these apps. Thank you.


