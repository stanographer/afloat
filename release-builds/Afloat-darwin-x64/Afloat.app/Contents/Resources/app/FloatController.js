var myApp = angular.module('Float',[])

myApp.controller('FloatController', function ($scope, $http) {

	$http.get('./resources/config.json')
		.then(function (res) {
			
			$scope.data = res.data;

	  		$scope.fontSize = $scope.data.fontSize;
	  		$scope.fontColor = $scope.data.fontColor;
	  		$scope.fontStyle = $scope.data.fontStyle;
	  		$scope.url = '';
	  		$scope.isValidURL = false;
	  		$scope.URLStatusMessage = '';
	  
	  });

	  $scope.checkURL = function (rawURL) {

	  	// Regex for invalid characters.
	  	var regexp  = /^[-\w]+$/;

	  	if (!rawURL == '') {

	  		// Turn user input into all lower and trim whitespace.
	  		var cleanURL = rawURL.toLowerCase().trim();

	  		// Makes sure it's an Aloft address (contains aloft.nu).
		  	if (cleanURL.includes('aloft.nu/')) {

		  		// Removes "http://" and "aloft.nu/."
		  		var elements = cleanURL.replace(/.*?:\/\//g, '').replace(/aloft.nu\//g, '');

		  		// Divides result into author name and event name.
				var author = elements.split('/')[0];
				var event = elements.split('/')[1];

				// Makes sure that an author and event name were extracted successfully.
				if (author && event) {

					// Makes sure the two keys do not have illegal characters.
					if (author.match(regexp) && event.match(regexp)) {
						$scope.isValidURL = true;
						$scope.URLStatusMessage = 'Yay! You have entered a valid Aloft URL!';
						openMe([author, event]);
					} else {
						// URL must consist of only alphanumeric characters, hyphens, or underscores.
						$scope.isValidURL = false;
						$scope.URLStatusMessage = 'Sorry. The URL must consist of only alphanumeric characters, hyphens, slashes, or underscores. It must not contain any spaces.';
					}
				} else {
					$scope.isValidURL = false;
					$scope.URLStatusMessage = 'Sorry. The URL you have entered is invalid. It must be in the form: http://aloft.nu/stanley/eventname.';
				}
		  	} else {
		  		$scope.isValidURL = false;
		  		$scope.URLStatusMessage = 'Sorry. The URL must be a valid aloft.nu address. Example: http://aloft.nu/stanley/eventname.';
		  	}
	  	} else {
	  		$scope.isValidURL = false;
		  	$scope.URLStatusMessage = 'Sorry. This field cannot be left blank!';
	  	}
	  }
});