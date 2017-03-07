var Subjects = React.createClass({
	
  render: function() {
		var guides = [];
		// var guides = [{subject:'hi'}];

		axios.get('/api/guides')
		  .then(function (response) {
		    guides = response.data;
		    console.log(guides);
		  })
		  .catch(function (error) {
		    console.log(error);
		  });

    var listItems = guides.map(function(guide) {
    	console.log('guide:', guide.subject);
      return (
        <div className="subject-div" key={guide.subject}>{guide.subject}
        </div>
      );
    });

    return (
      <div className="subjects">
          {listItems}
      </div>
    );
  }
});

ReactDOM.render(<Subjects />, document.getElementById('subjects'));

		// $http({
		//   method: 'GET',
		//   url: '/api/guides'
		// }).then(function successCallback(response) {
		//   guides.push(response.data);

		// }, function errorCallback(response) {
		//   console.log('There was an error getting the data', response);
		// });
