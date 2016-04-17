(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      BookPage = require('./components/bookPage.jsx'); // Our custom react component

  ReactDOM.render(React.createElement(BookPage, null), document.getElementById('bookPage'));

})();

},{"./components/bookPage.jsx":2,"react":"react","react-dom":"react-dom"}],2:[function(require,module,exports){
var React = require('react');
var Navbar = require('navbar.jsx');

var BookPage = React.createClass({displayName: "BookPage",
	childContextTypes: {
	},

	getChildContext: function() {
		return {
		 
		};
	},

	componentWillMount: function() {
	  
	},

	componentDidMount: function() {
		$('#allNav').attr('class','active');
		$('#allNav1').css("color","#2DCDE5");

		$.getJSON("api/all_books", function(data) {
			this.setState({all_books:data});
			//console.log(data);
			var all_books = data;
			var skills = [];
			var authors = [];
			
			var booksInfo = [];
			for(var i=0;i<all_books.length;i++){

				if(skills.indexOf(all_books[i].skill) == -1){
					skills.push(all_books[i].skill);
				}
				if(authors.indexOf(all_books[i].author) == -1){
					authors.push(all_books[i].author);
				}
			}
			
			var skillList=[];
			for(var j=0;j<skills.length;j++)
				skillList.push(React.createElement("li", {id: skills[j].replace(/\s+/g, "-")+"Nav"}, React.createElement("a", {id: skills[j].replace(/\s+/g, "-")+"Nav1", href: "/"}, " ", skills[j], " ")));

			this.setState({skill_list:skillList});

			var authorList=[];
			//sort authors alphabetically
			authors.sort(function(a, b) { 
			    if (a < b) { 
			        return -1;
			    } else if (a > b) {
			        return 1
			    } else { // nothing to split them
			        return 0;
			    }
			});

			for(var j=0;j<authors.length;j++)
				authorList.push(React.createElement("li", {id: authors[j].replace(/\s+/g, "-")+"Nav"}, React.createElement("a", {id: authors[j].replace(/\s+/g, "-")+"Nav1", href: "/"}, " ", authors[j], " ")));

			this.setState({author_list:authorList});

		}.bind(this));

		var book_id = getQueryVariable("book");

		function getQueryVariable(variable) {
			var query = window.location.search.substring(1);
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				if (pair[0] == variable) {
					return pair[1];
				}
			}  
		}

		$.getJSON("api/one_book?book="+book_id, function(data) {
			this.setState({book:data});
			$('#bookDescription').html(data.description);
			$('#thumbnail').height($('#bookDescription').height+100);
			$('#authorBio').html(data.author_bio);
			var ratings= data.ratings;
			var ratings_stars=[];
			if(ratings === 'No Ratings'){
				ratings_stars.push(React.createElement("span", {className: "glyphicon glyphicon-star-empty"}));
				ratings_stars.push(React.createElement("span", {className: "glyphicon glyphicon-star-empty"}));
				ratings_stars.push(React.createElement("span", {className: "glyphicon glyphicon-star-empty"}));
				ratings_stars.push(React.createElement("span", {className: "glyphicon glyphicon-star-empty"}));
				ratings_stars.push(React.createElement("span", {className: "glyphicon glyphicon-star-empty"}));
			}else{
				var ratings_number = parseInt(ratings.substring(0,1));
				for(var i=0; i<ratings_number; i++){
					ratings_stars.push(React.createElement("span", {className: "glyphicon glyphicon-star"}));
				}
				for(var j=0; j<5-ratings_number; j++){
					ratings_stars.push(React.createElement("span", {className: "glyphicon glyphicon-star-empty"}));
				}
			}
			this.setState({ratings_stars:ratings_stars});

		}.bind(this));

		$(function(){
		  $('#authorLink').click(function(){
		    if($(this).attr('href') === '#'){
		    	$("#modalDanger1").modal("show");
		    }
		  });
		});

	},

	getInitialState: function() {
		return {
			all_books:[],
			skill_list:[],
			author_list:[],
			book:{},
			ratings_stars:[]
		};
	},


	
	

	render: function() {
	

		return (
		React.createElement("div", null, 
			React.createElement("div", null, 
				React.createElement(Navbar, null)
			), 

			React.createElement("div", {id: "wrapper", className: "responsiveWrapper"}, 
				React.createElement("div", {id: "page-wrapper", style: {backgroundColor:'#363636', padding:'0px'}}, 
					React.createElement("div", {className: "container-fluid"}, 
				        React.createElement("div", {className: "row", style: {paddingTop:'10px'}}, 
				          React.createElement("div", {className: "col-md-9"}, 
				            React.createElement("div", {id: "thumbnail", className: "thumbnail", style: {minHeight:'250px'}}, 
				              React.createElement("img", {className: "img-responsive", style: {width:'200px', float:'left', marginTop:'20px'}, src: this.state.book.image, alt: true}), 
				              React.createElement("div", {className: "caption-full"}, 
				                React.createElement("h4", {className: "pull-right"}, this.state.book.price), 
				                React.createElement("h4", null, React.createElement("a", {href: "#"}, this.state.book.title)
				                ), 
				                React.createElement("h5", null, "Author: ", this.state.book.author), 
				                React.createElement("h5", null, "ISBN-10: ", this.state.book._id), 
				                React.createElement("p", null, "See more information from Amazon ", React.createElement("strong", null, React.createElement("a", {target: "_blank", href: this.state.book.link}, " Amazon - ", this.state.book.title))), 
				                 React.createElement("h5", null, "Book Description: "), 
				                React.createElement("div", {id: "bookDescription"}, " ")
				              ), 
				              React.createElement("div", {className: "ratings"}, 
				               
				                React.createElement("p", null, " Customer Ratings:", React.createElement("br", null), 
				                	
				                  this.state.ratings_stars, React.createElement("br", null), 
				     
				                  
				                  this.state.book.ratings
				                )
				              )
				            ), 
				            React.createElement("div", {className: "well"}, 
				              React.createElement("div", {className: "text-left"}, 
				              	React.createElement("h4", null, "About the Author")
				              ), 
				              React.createElement("div", {className: "text-right"}, 
				                React.createElement("a", {className: "btn btn-success", id: "authorLink", href: this.state.book.author_link !=='No author page'? this.state.book.author_link : '#'}, "Author's Page on Amazon")
				              ), 
				              React.createElement("hr", null), 
				              React.createElement("div", {className: "row"}, 
				                React.createElement("div", {className: "col-md-12"}, 
				                	React.createElement("div", {id: "authorBio"}, " ")
				                )
				              ), 
				              React.createElement("hr", null)
				            )
				          )
				        )
				    )
		      	)
		    ), 


			React.createElement("div", {className: "navbar navbar-inverse", role: "navigation"}, 
				React.createElement("ul", {className: "nav navbar-nav side-nav"}, 
					React.createElement("li", {id: "allNav"}, 
						React.createElement("a", {id: "allNav1", href: "/", "data-toggle": "collapse", "data-target": "#allBooks"}, "     All Books "), 
						React.createElement("ul", {id: "allBooks", className: "collapse"}
							
						)
					), 
					React.createElement("li", {id: "skillNav"}, 
						React.createElement("a", {id: "skillNav1", href: "#", "data-toggle": "collapse", "data-target": "#skill"}, "     Skill "), 
						React.createElement("ul", {id: "skill", className: "collapse"}, 
							this.state.skill_list
						)
					), 
					React.createElement("li", {id: "authorNav"}, 
						React.createElement("a", {id: "authorNav1", href: "#", "data-toggle": "collapse", "data-target": "#author"}, "     Author "), 
						React.createElement("ul", {id: "author", className: "collapse"}, 
							this.state.author_list
						)
					), 
					React.createElement("li", {id: "priceNav"}, 
						React.createElement("a", {id: "priceNav1", href: "#", "data-toggle": "collapse", "data-target": "#price"}, "     Price "), 
						React.createElement("ul", {id: "price", className: "collapse"}, 
							React.createElement("li", {id: "price20Nav"}, React.createElement("a", {id: "price20Nav1", href: "/"}, " $0 - $20.0 ")), 
							React.createElement("li", {id: "price40Nav"}, React.createElement("a", {id: "price40Nav1", href: "/"}, " $20.0 - $40.0 ")), 							
							React.createElement("li", {id: "price40aboveNav"}, React.createElement("a", {id: "price40aboveNav1", href: "/"}, " $40.0 above "))
						)
					), 
					React.createElement("li", {id: "ratingsNav"}, 
						React.createElement("a", {id: "ratingsNav1", href: "#", "data-toggle": "collapse", "data-target": "#ratings"}, "     Ratings "), 
						React.createElement("ul", {id: "ratings", className: "collapse"}, 
							React.createElement("li", {id: "ratings3Nav"}, React.createElement("a", {id: "ratings3Nav1", href: "/"}, " Average 1 - 3 stars ")), 
							React.createElement("li", {id: "ratings5Nav"}, React.createElement("a", {id: "ratings5Nav1", href: "/"}, " Average 3 - 5 stars "))
						)
					)
				)
			), 
			React.createElement("div", {className: "modal fade modal-danger", id: "modalDanger1", tabIndex: -1, role: "dialog", "aria-labelledby": "myModalLabel", "aria-hidden": "true"}, 
				React.createElement("div", {className: "modal-dialog"}, 
					React.createElement("div", {className: "modal-content"}, 
						React.createElement("div", {className: "modal-header"}, 
							React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
							React.createElement("h4", {className: "modal-title", id: "myModalLabel"}, "Sorry")
						), 
						React.createElement("div", {className: "modal-body"}, 
							"Sorry, we cannot find author page on amazon."
						), 
						React.createElement("div", {className: "modal-footer"}, 
								React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "Close")
						)
					)
				)
			)


		)
			
		);
	}
});

module.exports = BookPage;

},{"navbar.jsx":"navbar.jsx","react":"react"}]},{},[1]);
