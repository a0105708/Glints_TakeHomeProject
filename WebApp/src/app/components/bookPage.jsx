var React = require('react');
var Navbar = require('navbar.jsx');

var BookPage = React.createClass({
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
				skillList.push(<li id={skills[j].replace(/\s+/g, "-")+"Nav"}><a id={skills[j].replace(/\s+/g, "-")+"Nav1"} href="/"  > {skills[j]} </a></li>);

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
				authorList.push(<li id={authors[j].replace(/\s+/g, "-")+"Nav"}><a id={authors[j].replace(/\s+/g, "-")+"Nav1"} href="/" > {authors[j]} </a></li>);

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
				ratings_stars.push(<span className="glyphicon glyphicon-star-empty" />);
				ratings_stars.push(<span className="glyphicon glyphicon-star-empty" />);
				ratings_stars.push(<span className="glyphicon glyphicon-star-empty" />);
				ratings_stars.push(<span className="glyphicon glyphicon-star-empty" />);
				ratings_stars.push(<span className="glyphicon glyphicon-star-empty" />);
			}else{
				var ratings_number = parseInt(ratings.substring(0,1));
				for(var i=0; i<ratings_number; i++){
					ratings_stars.push(<span className="glyphicon glyphicon-star" />);
				}
				for(var j=0; j<5-ratings_number; j++){
					ratings_stars.push(<span className="glyphicon glyphicon-star-empty" />);
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
		<div>
			<div> 
				<Navbar/>
			</div>

			<div id="wrapper" className="responsiveWrapper">
				<div id="page-wrapper" style={{backgroundColor:'#363636', padding:'0px'}}>
					<div className="container-fluid">
				        <div className="row" style={{paddingTop:'10px'}}>
				          <div className="col-md-9">
				            <div id="thumbnail" className="thumbnail" style={{minHeight:'250px'}}>
				              <img className="img-responsive" style={{width:'200px', float:'left', marginTop:'20px'}} src={this.state.book.image} alt />
				              <div className="caption-full">
				                <h4 className="pull-right">{this.state.book.price}</h4>
				                <h4><a href="#">{this.state.book.title}</a>
				                </h4>
				                <h5>Author: {this.state.book.author}</h5>
				                <h5>ISBN-10: {this.state.book._id}</h5>
				                <p>See more information from Amazon <strong><a target="_blank" href={this.state.book.link}> Amazon - {this.state.book.title}</a></strong></p>
				                 <h5>Book Description: </h5>
				                <div id="bookDescription"> </div>
				              </div>
				              <div className="ratings">
				               
				                <p> Customer Ratings:<br/>
				                	
				                  {this.state.ratings_stars}<br/>
				     
				                  
				                  {this.state.book.ratings}
				                </p>
				              </div>
				            </div>
				            <div className="well">
				              <div className="text-left">
				              	<h4>About the Author</h4>
				              </div>
				              <div className="text-right">
				                <a className="btn btn-success" id="authorLink"  href={this.state.book.author_link !=='No author page'? this.state.book.author_link : '#' }>Author's Page on Amazon</a>
				              </div>
				              <hr />
				              <div className="row">
				                <div className="col-md-12">
				                	<div id="authorBio"> </div>
				                </div>
				              </div>
				              <hr />
				            </div>
				          </div>
				        </div>
				    </div>
		      	</div>
		    </div>


			<div className="navbar navbar-inverse" role="navigation">
				<ul className="nav navbar-nav side-nav" >
					<li id="allNav" >
						<a id="allNav1" href="/" data-toggle="collapse" data-target="#allBooks"> &nbsp;&nbsp;&nbsp;&nbsp;All Books </a>
						<ul id="allBooks" className="collapse">
							
						</ul>
					</li>
					<li id="skillNav" >
						<a id="skillNav1" href="#" data-toggle="collapse" data-target="#skill"> &nbsp;&nbsp;&nbsp;&nbsp;Skill </a>
						<ul id="skill" className="collapse">
							{this.state.skill_list}
						</ul>
					</li>
					<li id="authorNav" >
						<a id="authorNav1" href="#"  data-toggle="collapse" data-target="#author"> &nbsp;&nbsp;&nbsp;&nbsp;Author </a>
						<ul id="author" className="collapse">
							{this.state.author_list}
						</ul>
					</li>
					<li id="priceNav">
						<a id="priceNav1" href="#"  data-toggle="collapse" data-target="#price"> &nbsp;&nbsp;&nbsp;&nbsp;Price </a>
						<ul id="price" className="collapse">
							<li id="price20Nav"><a id="price20Nav1" href="/"  > $0 - $20.0 </a></li>
							<li id="price40Nav"><a id="price40Nav1" href="/"  > $20.0 - $40.0 </a></li>							
							<li id="price40aboveNav"><a id="price40aboveNav1" href="/"  > $40.0 above </a></li>
						</ul>
					</li>
					<li id="ratingsNav">
						<a id="ratingsNav1" href="#" data-toggle="collapse" data-target="#ratings"> &nbsp;&nbsp;&nbsp;&nbsp;Ratings </a>
						<ul id="ratings" className="collapse">
							<li id="ratings3Nav"><a id="ratings3Nav1" href="/"  > Average 1 - 3 stars </a></li>
							<li id="ratings5Nav"><a id="ratings5Nav1" href="/"  > Average 3 - 5 stars </a></li>
						</ul>
					</li>
				</ul>
			</div>
			<div className="modal fade modal-danger" id="modalDanger1" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
							<h4 className="modal-title" id="myModalLabel">Sorry</h4>
						</div>
						<div className="modal-body">
							Sorry, we cannot find author page on amazon.
						</div>
						<div className="modal-footer">
								<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>


		</div>
			
		);
	}
});

module.exports = BookPage;
