var React = require('react');

var Navbar = React.createClass({

	highlightLibrary: function() {
		$('#libraryButton').css("backgroundColor","#494949");
		$('#libraryButtonText').css("color","#2DCDE5");
	},

	unhighlight: function() {	
		$('#libraryButton').css("backgroundColor","black");
		$('#libraryButtonText').css("color","#FFFFFF");
	},

	componentWillMount: function () {

	},

	componentDidMount: function() {		
		
	},

	componentWillReceiveProps: function(nextProps) {
		
	},

	getDefaultProps: function() {
		return({
			
		});
	},

	getInitialState: function(){
		return({
			
		});
	},


	render: function() {

		return (
		<div style={{marginBottom:'0px'}}>
			<div style={{height:'50px', padding: '3px 0 5px 0', backgroundColor:'black', position: 'relative',width:'100%'}}>
				<div style={{width: '150px', textAlign: 'center', display: 'inline-block'}}>
					<a href="/">
						<img src="/img/logo.png" style={{width:'50px', marginBottom: '-12px'}} />		
					</a>
				</div> 
				<div className="btn-group navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<button type="button" className="btn btn-default dropdown-toggle" style={{marginRight:'30px',verticalAlign:'middle',marginTop:'-10px',width:'40px'}}  data-toggle="dropdown" aria-expanded="false"> <span className="glyphicon glyphicon-menu-hamburger"></span></button>
					<ul className="dropdown-menu" role="menu" style={{marginLeft:'-60px'}}>
						<li><a href="/">MY LIBRARY</a></li>		
						<li className="divider"></li>
					</ul> 
				</div>
				<div id="navbar" className="navbar-collapse collapse" style={{marginTop:'-25px',marginLeft:'120px'}}>
					<div id="libraryButton" style={{ display: 'inline-block', width: '150px', textAlign: 'center',  padding: '8px', cursor: 'pointer'}} onMouseOver={this.highlightLibrary} onMouseOut={this.unhighlight}>
						<h2 id="libraryButtonText" style={{color:'white',fontSize:'1.4em'}}>MY LIBRARY</h2>
					</div>
					
				</div>
			</div>
		</div>
		
		);
	}
});

module.exports = Navbar;
