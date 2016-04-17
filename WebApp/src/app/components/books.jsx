var React = require('react');
var Navbar = require('navbar.jsx');

var Books = React.createClass({
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

				booksInfo.push(
					<div className="col-sm-6 col-md-4 col-lg-3 onePhoto" style={{marginBottom:'20px',width:'200px',height:'200px',paddingLeft:'0px'}}>
						<div className="portfolio-item" style={{width:'200px',height:'200px',paddingLeft:'0px'}} >
							<div className="hover-bg" style={{width:'200px',height:'200px',paddingLeft:'0px'}}>	
								<div className="hover-text" style={{width:'200px',height:'200px'}} >
									<span title={all_books[i].title}>
										<h5>{all_books[i].title.length > 50 ? all_books[i].title.substring(0,50)+'...' : all_books[i].title}</h5>	
										<h5>{'by '+all_books[i].author} </h5>
										<h4 style={{color: '#FCAC45'}}>{all_books[i].price} </h4>
										<h5 style={{color: '#2DCDE5'}}>{'Skill: '+all_books[i].skill} </h5>
										<small>{'ISBN-10: '+all_books[i].id} </small><br/>
										<h5 style={{color: '#FCAC45'}}>{'Ratings: '+all_books[i].ratings} </h5>
										
										<div className="clearfix" />			
										
										<a href={"bookPage.html?book="+all_books[i].id} title="View Book Details">
											<i className="fa fa-book" />
										</a>
									</span>

								</div>
								<img className="squareImg lazy" data-original={all_books[i].image} src="img/logo.png" width="200" height="200" />
							</div>
						</div>
					</div>
				);
			}

			this.setState({current_filter: 'All Books'});
			this.setState({books_info: booksInfo});
			this.setState({current_books: all_books});
		
			$('#lightbox').css('height','100%');
			$('#lightbox').css('display','block');
			$('#lightbox').css('overflow','scroll');

			
			var skillList=[];
			for(var j=0;j<skills.length;j++)
				skillList.push(<li id={skills[j].replace(/\s+/g, "-")+"Nav"}><a id={skills[j].replace(/\s+/g, "-")+"Nav1"} href="#"  onClick={this.filterBySkill.bind(this, skills[j])}> {skills[j]} </a></li>);

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
				authorList.push(<li id={authors[j].replace(/\s+/g, "-")+"Nav"}><a id={authors[j].replace(/\s+/g, "-")+"Nav1"} href="#"  onClick={this.filterByAuthor.bind(this, authors[j])}> {authors[j]} </a></li>);

			this.setState({author_list:authorList});


			if(all_books.length === 0){
				this.setState({info_section: [<h4 style={{color:'orange'}}> No books found.</h4>]});
			}else {
				this.setState({info_section: [<h4 style={{color:'white'}}> Search Results: {this.state.all_books.length} Books  &nbsp;&nbsp;  </h4>]});
			}
		
			
			$(function() {
				$("img.lazy").lazyload({         
					effect : "fadeIn",
				});
			});

			$(function() {
				$("img.lazy").lazyload({         
					effect : "fadeIn",
					container: $("#lightbox"),
				});
			});

		}.bind(this));

	},

	getInitialState: function() {
		return {
			all_books:[],
			skill_list:[],
			author_list:[],
			current_books:[],
			current_filter:'',
			info_section:[],
			books_info:[]
		};
	},


	filterByAuthor: function(author){
		//console.log(author);
		var all_books = this.state.all_books;
		var filtered_books = all_books.filter(function (book){
			return book.author === author;
		});
		//console.log(filtered_books);
		$('#authorNav').attr('class','active');
		$('#authorNav1').css("color","#2DCDE5");
		$('#priceNav').removeClass('active');
		$('#priceNav1').css("color","#999");
		$('#allNav').removeClass('active');
		$('#allNav1').css("color","#999");
		$('#ratingsNav').removeClass('active');
		$('#ratingsNav1').css("color","#999");
		$('#skillNav').removeClass('active');
		$('#skillNav1').css("color","#999");
		$('#byPriceFilter').removeClass('active');
		$('#byTitleFilter').removeClass('active');
		$('#byRatingsFilter').removeClass('active');


		var booksInfo=[];
		for(var i=0; i<filtered_books.length; i++){
			booksInfo.push(
				<div className="col-sm-6 col-md-4 col-lg-3 onePhoto" style={{marginBottom:'20px',width:'200px',height:'200px',paddingLeft:'0px'}}>
					<div className="portfolio-item" style={{width:'200px',height:'200px',paddingLeft:'0px'}} >
						<div className="hover-bg" style={{width:'200px',height:'200px',paddingLeft:'0px'}}>	
							<div className="hover-text" style={{width:'200px',height:'200px'}} >
								<span title={filtered_books[i].title}>
									<h5>{filtered_books[i].title.length > 50 ? filtered_books[i].title.substring(0,50)+'...' : filtered_books[i].title}</h5>
									<h5>{'by '+filtered_books[i].author} </h5>
									<h4 style={{color: '#FCAC45'}}>{filtered_books[i].price} </h4>
									<h5 style={{color: '#2DCDE5'}}>{'Skill: '+filtered_books[i].skill} </h5>
									<small>{'ISBN-10: '+filtered_books[i].id} </small><br/>
									<h5 style={{color: '#FCAC45'}}>{'Ratings: '+filtered_books[i].ratings} </h5>
									
									<div className="clearfix" />			
									
									<a href={"bookPage.html?book="+filtered_books[i].id} title="View Book Details">
										<i className="fa fa-book" />
									</a>
								</span>

							</div>
							<img className="squareImg lazy" data-original={filtered_books[i].image} src="img/logo.png" width="200" height="200" />
						</div>
					</div>
				</div>
			);
		}
		$('#lightbox').css('height','100%');
		$('#lightbox').css('display','block');
		$('#lightbox').css('overflow','scroll');

		this.setState({current_filter: 'Filter by Author: '+author});
		this.setState({books_info: booksInfo});
		this.setState({current_books: filtered_books},function(){
			$(function() {
				$("img.lazy").lazyload({         
					effect : "fadeIn",
					container: $("#lightbox"),
				});
			});
		});
		

		if(filtered_books.length === 0){
			this.setState({info_section: [<h4 style={{color:'orange'}}> No books found.</h4>]});
		}else {
			this.setState({info_section: [<h4 style={{color:'white'}}> Search Results: {filtered_books.length} Books  &nbsp;&nbsp;  </h4>]});
		}

	},

	filterBySkill: function(skill){
		//console.log(skill);
		var all_books = this.state.all_books;
		var filtered_books = all_books.filter(function (book){
			return book.skill === skill;
		});
		//console.log(filtered_books);
		$('#skillNav').attr('class','active');
		$('#skillNav1').css("color","#2DCDE5");
		$('#priceNav').removeClass('active');
		$('#priceNav1').css("color","#999");
		$('#allNav').removeClass('active');
		$('#allNav1').css("color","#999");
		$('#ratingsNav').removeClass('active');
		$('#ratingsNav1').css("color","#999");
		$('#authorNav').removeClass('active');
		$('#authorNav1').css("color","#999");
		$('#byPriceFilter').removeClass('active');
		$('#byTitleFilter').removeClass('active');
		$('#byRatingsFilter').removeClass('active');


		var booksInfo=[];
		for(var i=0; i<filtered_books.length; i++){
			booksInfo.push(
				<div className="col-sm-6 col-md-4 col-lg-3 onePhoto" style={{marginBottom:'20px',width:'200px',height:'200px',paddingLeft:'0px'}}>
					<div className="portfolio-item" style={{width:'200px',height:'200px',paddingLeft:'0px'}} >
						<div className="hover-bg" style={{width:'200px',height:'200px',paddingLeft:'0px'}}>	
							<div className="hover-text" style={{width:'200px',height:'200px'}} >
								<span title={filtered_books[i].title}>
									<h5>{filtered_books[i].title.length > 50 ? filtered_books[i].title.substring(0,50)+'...' : filtered_books[i].title}</h5>
									<h5>{'by '+filtered_books[i].author} </h5>
									<h4 style={{color: '#FCAC45'}}>{filtered_books[i].price} </h4>
									<h5 style={{color: '#2DCDE5'}}>{'Skill: '+filtered_books[i].skill} </h5>
									<small>{'ISBN-10: '+filtered_books[i].id} </small><br/>
									<h5 style={{color: '#FCAC45'}}>{'Ratings: '+filtered_books[i].ratings} </h5>
									
									<div className="clearfix" />			
									
									<a href={"bookPage.html?book="+filtered_books[i].id} title="View Book Details">
										<i className="fa fa-book" />
									</a>
								</span>

							</div>
							<img className="squareImg lazy" data-original={filtered_books[i].image} src="img/logo.png" width="200" height="200" />
						</div>
					</div>
				</div>
			);
		}
		$('#lightbox').css('height','100%');
		$('#lightbox').css('display','block');
		$('#lightbox').css('overflow','scroll');

		this.setState({current_filter: 'Filter by Skill: '+skill});
		this.setState({books_info: booksInfo});
		this.setState({current_books: filtered_books},function(){
			$(function() {
				$("img.lazy").lazyload({         
					effect : "fadeIn",
					container: $("#lightbox"),
				});
			});
		});
		

		if(filtered_books.length === 0){
			this.setState({info_section: [<h4 style={{color:'orange'}}> No books found.</h4>]});
		}else {
			this.setState({info_section: [<h4 style={{color:'white'}}> Search Results: {filtered_books.length} Books  &nbsp;&nbsp;  </h4>]});
		}


	},

	filterByPrice: function(price){
		//console.log(price);
		var all_books = this.state.all_books;
		var filtered_books = [];
		var price_string;
		if(price === '20'){
			price_string='$0 - $20.0';
			filtered_books = all_books.filter(function (book){
				return book.price <= '$20.0' || book.price === 'Kindle Edition $0.00';
			});
		}else if(price === '40'){
			price_string='$20.0 - $40.0';
			filtered_books = all_books.filter(function (book){
				return book.price <= '$40.0' && book.price > '$20.0' && book.price !== 'Kindle Edition $0.00';
			});
		}else {
			price_string='$40.0 above';
			filtered_books = all_books.filter(function (book){
				return book.price > '$40.0' && book.price !== 'Kindle Edition $0.00';
			});
		}
		
		//console.log(filtered_books);
		$('#priceNav').attr('class','active');
		$('#priceNav1').css("color","#2DCDE5");
		$('#skillNav').removeClass('active');
		$('#skillNav1').css("color","#999");
		$('#allNav').removeClass('active');
		$('#allNav1').css("color","#999");
		$('#ratingsNav').removeClass('active');
		$('#ratingsNav1').css("color","#999");
		$('#authorNav').removeClass('active');
		$('#authorNav1').css("color","#999");
		$('#byPriceFilter').removeClass('active');
		$('#byTitleFilter').removeClass('active');
		$('#byRatingsFilter').removeClass('active');


		var booksInfo=[];
		for(var i=0; i<filtered_books.length; i++){
			booksInfo.push(
				<div className="col-sm-6 col-md-4 col-lg-3 onePhoto" style={{marginBottom:'20px',width:'200px',height:'200px',paddingLeft:'0px'}}>
					<div className="portfolio-item" style={{width:'200px',height:'200px',paddingLeft:'0px'}} >
						<div className="hover-bg" style={{width:'200px',height:'200px',paddingLeft:'0px'}}>	
							<div className="hover-text" style={{width:'200px',height:'200px'}} >
								<span title={filtered_books[i].title}>
									<h5>{filtered_books[i].title.length > 50 ? filtered_books[i].title.substring(0,50)+'...' : filtered_books[i].title}</h5>
									<h5>{'by '+filtered_books[i].author} </h5>
									<h4 style={{color: '#FCAC45'}}>{filtered_books[i].price} </h4>
									<h5 style={{color: '#2DCDE5'}}>{'Skill: '+filtered_books[i].skill} </h5>
									<small>{'ISBN-10: '+filtered_books[i].id} </small><br/>
									<h5 style={{color: '#FCAC45'}}>{'Ratings: '+filtered_books[i].ratings} </h5>
									
									<div className="clearfix" />			
									
									<a href={"bookPage.html?book="+filtered_books[i].id} title="View Book Details">
										<i className="fa fa-book" />
									</a>
								</span>

							</div>
							<img className="squareImg lazy" data-original={filtered_books[i].image} src="img/logo.png" width="200" height="200" />
						</div>
					</div>
				</div>
			);
		}
		$('#lightbox').css('height','100%');
		$('#lightbox').css('display','block');
		$('#lightbox').css('overflow','scroll');

		this.setState({current_filter: 'Filter by Price: '+price_string});
		this.setState({books_info: booksInfo});
		this.setState({current_books: filtered_books},function(){
			$(function() {
				$("img.lazy").lazyload({         
					effect : "fadeIn",
					container: $("#lightbox"),
				});
			});
		});
		

		if(filtered_books.length === 0){
			this.setState({info_section: [<h4 style={{color:'orange'}}> No books found.</h4>]});
		}else {
			this.setState({info_section: [<h4 style={{color:'white'}}> Search Results: {filtered_books.length} Books  &nbsp;&nbsp;  </h4>]});
		}

	},

	filterByRatings: function(ratings){
		//console.log(ratings);
		var all_books = this.state.all_books;
		var filtered_books = [];
		var ratings_string;
		if(ratings === '3'){
			ratings_string='Average 1 - 3 stars';
			filtered_books = all_books.filter(function (book){
				return book.ratings <= '3.0 out of 5 stars' || book.ratings === 'No Ratings';
			});
		}else {
			ratings_string='Average 3 - 5 stars';
			filtered_books = all_books.filter(function (book){
				return book.ratings > '3.0 out of 5 stars' && book.ratings !== 'No Ratings';
			});
		}
		
		//console.log(filtered_books);
		$('#ratingsNav').attr('class','active');
		$('#ratingsNav1').css("color","#2DCDE5");
		$('#skillNav').removeClass('active');
		$('#skillNav1').css("color","#999");
		$('#allNav').removeClass('active');
		$('#allNav1').css("color","#999");
		$('#priceNav').removeClass('active');
		$('#priceNav1').css("color","#999");
		$('#authorNav').removeClass('active');
		$('#authorNav1').css("color","#999");
		$('#byPriceFilter').removeClass('active');
		$('#byTitleFilter').removeClass('active');
		$('#byRatingsFilter').removeClass('active');


		var booksInfo=[];
		for(var i=0; i<filtered_books.length; i++){
			booksInfo.push(
				<div className="col-sm-6 col-md-4 col-lg-3 onePhoto" style={{marginBottom:'20px',width:'200px',height:'200px',paddingLeft:'0px'}}>
					<div className="portfolio-item" style={{width:'200px',height:'200px',paddingLeft:'0px'}} >
						<div className="hover-bg" style={{width:'200px',height:'200px',paddingLeft:'0px'}}>	
							<div className="hover-text" style={{width:'200px',height:'200px'}} >
								<span title={filtered_books[i].title}>
									<h5>{filtered_books[i].title.length > 50 ? filtered_books[i].title.substring(0,50)+'...' : filtered_books[i].title}</h5>
									<h5>{'by '+filtered_books[i].author} </h5>
									<h4 style={{color: '#FCAC45'}}>{filtered_books[i].price} </h4>
									<h5 style={{color: '#2DCDE5'}}>{'Skill: '+filtered_books[i].skill} </h5>
									<small>{'ISBN-10: '+filtered_books[i].id} </small><br/>
									<h5 style={{color: '#FCAC45'}}>{'Ratings: '+filtered_books[i].ratings} </h5>
									
									<div className="clearfix" />			
									
									<a href={"bookPage.html?book="+filtered_books[i].id} title="View Book Details">
										<i className="fa fa-book" />
									</a>
								</span>

							</div>
							<img className="squareImg lazy" data-original={filtered_books[i].image} src="img/logo.png" width="200" height="200" />
						</div>
					</div>
				</div>
			);
		}
		$('#lightbox').css('height','100%');
		$('#lightbox').css('display','block');
		$('#lightbox').css('overflow','scroll');

		this.setState({current_filter: 'Filter by Customer Ratings: '+ratings_string});
		this.setState({books_info: booksInfo});
		this.setState({current_books: filtered_books},function(){
			$(function() {
				$("img.lazy").lazyload({         
					effect : "fadeIn",
					container: $("#lightbox"),
				});
			});
		});
		

		if(filtered_books.length === 0){
			this.setState({info_section: [<h4 style={{color:'orange'}}> No books found.</h4>]});
		}else {
			this.setState({info_section: [<h4 style={{color:'white'}}> Search Results: {filtered_books.length} Books  &nbsp;&nbsp;  </h4>]});
		}
	},

	sortBy: function(variable){

		var current_books = this.state.current_books;
		if(variable === 'price'){
			current_books.sort(function(a, b) { 
			    if (a.price < b.price) { 
			        return -1;
			    } else if (a.price > b.price) {
			        return 1
			    } else { // nothing to split them
			        return 0;
			    }
			});

			$('#byPriceFilter').addClass('active');
			$('#byRatingsFilter').removeClass('active');
			$('#byTitleFilter').removeClass('active');
		}else if(variable === 'ratings'){
			current_books.sort(function(a, b) { 
			    if (a.ratings > b.ratings) { 
			        return -1;
			    } else if (a.ratings < b.ratings) {
			        return 1
			    } else { // nothing to split them
			        return 0;
			    }
			});

			$('#byRatingsFilter').addClass('active');
			$('#byPriceFilter').removeClass('active');
			$('#byTitleFilter').removeClass('active');
		}else if(variable === 'title'){
			current_books.sort(function(a, b) { 
			    if (a.title < b.title) { 
			        return -1;
			    } else if (a.title > b.title) {
			        return 1
			    } else { // nothing to split them
			        return 0;
			    }
			});

			$('#byTitleFilter').addClass('active');
			$('#byPriceFilter').removeClass('active');
			$('#byRatingsFilter').removeClass('active');
		}
		
		var booksInfo=[];
		for(var i=0; i<current_books.length; i++){
			booksInfo.push(
				<div className="col-sm-6 col-md-4 col-lg-3 onePhoto" style={{marginBottom:'20px',width:'200px',height:'200px',paddingLeft:'0px'}}>
					<div className="portfolio-item" style={{width:'200px',height:'200px',paddingLeft:'0px'}} >
						<div className="hover-bg" style={{width:'200px',height:'200px',paddingLeft:'0px'}}>	
							<div className="hover-text" style={{width:'200px',height:'200px'}} >
								<span title={current_books[i].title}>
									<h5>{current_books[i].title.length > 50 ? current_books[i].title.substring(0,50)+'...' : current_books[i].title}</h5>
									<h5>{'by '+current_books[i].author} </h5>
									<h4 style={{color: '#FCAC45'}}>{current_books[i].price} </h4>
									<h5 style={{color: '#2DCDE5'}}>{'Skill: '+current_books[i].skill} </h5>
									<small>{'ISBN-10: '+current_books[i].id} </small><br/>
									<h5 style={{color: '#FCAC45'}}>{'Ratings: '+current_books[i].ratings} </h5>
									
									<div className="clearfix" />			
									
									<a href={"bookPage.html?book="+current_books[i].id} title="View Book Details">
										<i className="fa fa-book" />
									</a>
								</span>

							</div>
							<img className="squareImg lazy" data-original={current_books[i].image} src="img/logo.png" width="200" height="200" />
						</div>
					</div>
				</div>
			);
		}
		$('#lightbox').css('height','100%');
		$('#lightbox').css('display','block');
		$('#lightbox').css('overflow','scroll');


		this.setState({books_info: booksInfo},function(){
			$(function() {
				$("img.lazy").lazyload({         
					effect : "fadeIn",
					container: $("#lightbox"),
				});
			});
		});


	},

	showAllBooks: function(){
		var all_books = this.state.all_books;
		all_books.sort(function(a, b) { 
		    if (a.id < b.id) { 
		        return -1;
		    } else if (a.id > b.id) {
		        return 1
		    } else { // nothing to split them
		        return 0;
		    }
		});

		//console.log(all_books);
		$('#allNav').attr('class','active');
		$('#allNav1').css("color","#2DCDE5");
		$('#priceNav').removeClass('active');
		$('#priceNav1').css("color","#999");
		$('#skillNav').removeClass('active');
		$('#skillNav1').css("color","#999");
		$('#ratingsNav').removeClass('active');
		$('#ratingsNav1').css("color","#999");
		$('#authorNav').removeClass('active');
		$('#authorNav1').css("color","#999");
		$('#byPriceFilter').removeClass('active');
		$('#byTitleFilter').removeClass('active');
		$('#byRatingsFilter').removeClass('active');


		var booksInfo=[];
		for(var i=0; i<all_books.length; i++){
			booksInfo.push(
				<div className="col-sm-6 col-md-4 col-lg-3 onePhoto" style={{marginBottom:'20px',width:'200px',height:'200px',paddingLeft:'0px'}}>
					<div className="portfolio-item" style={{width:'200px',height:'200px',paddingLeft:'0px'}} >
						<div className="hover-bg" style={{width:'200px',height:'200px',paddingLeft:'0px'}}>	
							<div className="hover-text" style={{width:'200px',height:'200px'}} >
								<span title={all_books[i].title}>
									<h5>{all_books[i].title.length > 50 ? all_books[i].title.substring(0,50)+'...' : all_books[i].title}</h5>
									<h5>{'by '+all_books[i].author} </h5>
									<h4 style={{color: '#FCAC45'}}>{all_books[i].price} </h4>
									<h5 style={{color: '#2DCDE5'}}>{'Skill: '+all_books[i].skill} </h5>
									<small>{'ISBN-10: '+all_books[i].id} </small><br/>
									<h5 style={{color: '#FCAC45'}}>{'Ratings: '+all_books[i].ratings} </h5>
									
									<div className="clearfix" />			
									
									<a href={"bookPage.html?book="+all_books[i].id} title="View Book Details">
										<i className="fa fa-book" />
									</a>
								</span>

							</div>
							<img className="squareImg lazy" data-original={all_books[i].image} src="img/logo.png" width="200" height="200" />
						</div>
					</div>
				</div>
			);
		}
		$('#lightbox').css('height','100%');
		$('#lightbox').css('display','block');
		$('#lightbox').css('overflow','scroll');

		
		
		this.setState({current_filter:'All Books', books_info: booksInfo, current_books: all_books}, function(){
			$(function() {
				$("img.lazy").lazyload({         
					effect : "fadeIn",
					container: $("#lightbox"),
				});
			});
		});

		if(all_books.length === 0){
			this.setState({info_section: [<h4 style={{color:'orange'}}> No books found.</h4>]});
		}else {
			this.setState({info_section: [<h4 style={{color:'white'}}> Search Results: {this.state.all_books.length} Books  &nbsp;&nbsp;  </h4>]});
		}


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
						<div id="links">
							<div id="tf-works" style={{marginTop:'-40px'}}>
								<div className="page-wrapper" >
									<h3 id="libraryTitle" style={{color:'white',marginBottom:'10px'}}>{this.state.current_filter}  </h3>
									<div className="categories">
										<ul className="cat">
											<li className="pull-left"> {this.state.info_section}
											</li>
											<li className="pull-right" style={{marginRight:'20px'}}>
												<ol className="type">
													<li><a id="gridViewLink" href="#"  style={{color:'rgb(45, 205, 229)'}} ><strong>Grid View</strong></a></li>
												</ol>
											</li>
										</ul>
										<div className="clearfix" />
										<li className="pull-right" style={{marginRight:'20px',marginBottom:'-20px'}}>
											<ol className="type">
												<li><a id="byTitleFilter" href="#" onClick={this.sortBy.bind(this, "title")} > By Title (A-Z)</a></li>
												<li><a id="byPriceFilter" href="#" onClick={this.sortBy.bind(this, "price")} > By Price (Low to High)</a></li>
												<li><a id="byRatingsFilter" href="#" onClick={this.sortBy.bind(this, "ratings")} > By Customer Ratings (High to Low)</a></li>

											</ol>
										</li>
										<div className="clearfix" />
									</div>
									<div id="lightbox" className="row" style={{overflow:'scroll',height:'1000px'}} >
										<div id="filterBy">
											{this.state.books_info}
										</div> 
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="navbar navbar-inverse" role="navigation">
				<ul className="nav navbar-nav side-nav" >
					<li id="allNav" >
						<a id="allNav1" href="#" data-toggle="collapse"  onClick={this.showAllBooks} data-target="#allBooks"> &nbsp;&nbsp;&nbsp;&nbsp;All Books </a>
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
							<li id="price20Nav"><a id="price20Nav1" href="#"  onClick={this.filterByPrice.bind(this, "20")}> $0 - $20.0 </a></li>
							<li id="price40Nav"><a id="price40Nav1" href="#"  onClick={this.filterByPrice.bind(this, "40")}> $20.0 - $40.0 </a></li>							
							<li id="price40aboveNav"><a id="price40aboveNav1" href="#"  onClick={this.filterByPrice.bind(this, "40above")}> $40.0 above </a></li>
						</ul>
					</li>
					<li id="ratingsNav">
						<a id="ratingsNav1" href="#" data-toggle="collapse" data-target="#ratings"> &nbsp;&nbsp;&nbsp;&nbsp;Ratings </a>
						<ul id="ratings" className="collapse">
							<li id="ratings3Nav"><a id="ratings3Nav1" href="#"  onClick={this.filterByRatings.bind(this, "3")}> Average 1 - 3 stars </a></li>
							<li id="ratings5Nav"><a id="ratings5Nav1" href="#"  onClick={this.filterByRatings.bind(this, "5")}> Average 3 - 5 stars </a></li>
						</ul>
					</li>
				</ul>
			</div>

		</div>
			
		);
	}
});

module.exports = Books;
