(function () {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      BookPage = require('./components/bookPage.jsx'); // Our custom react component

  ReactDOM.render(<BookPage />, document.getElementById('bookPage'));

})();