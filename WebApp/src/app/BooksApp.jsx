(function () {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      Books = require('./components/books.jsx'); // Our custom react component

  ReactDOM.render(<Books />, document.getElementById('books'));

})();