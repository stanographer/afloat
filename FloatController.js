var myApp = angular.module('Float',[])

myApp.controller('FloatController', function ($scope, $http, $rootScope) {
	$scope.url = '';
	$scope.checked;
	$scope.isValidURL = false;
	$scope.URLStatusMessage = '';
	$scope.lastURL;
	$scope.bgColor;
	$scope.lineHeight;
	$scope.fonts;
	$scope.width;
	$scope.height;
	$scope.transparency;
	$scope.selectedFont;
	$scope.userFonts;
	$scope.formCss = {
	  'background-color': '',
	  'color': ''
	}

	$scope.loadConfig = function () {
		$http.get('./resources/config.json')
		.then(function (res) {
			
			$scope.data = res.data;

	  		$scope.fontSize = $scope.data.fontSize;
	  		$scope.fontColor = $scope.data.fontColor;
	  		$scope.fontStyle = $scope.data.fontStyle;
	  		$scope.fonts = $scope.data.fonts;
	  		$scope.lastURL = $scope.data.lastURL;
	  		$scope.bgColor = $scope.data.bgColor;
	  		$scope.fonts = $scope.data.fonts;
	  		$scope.transparency = $scope.data.transparency;
	  		$scope.width = $scope.data.width;
	  		$scope.height = $scope.data.height;
	  		$scope.lineHeight = $scope.data.lineHeight;
	  		$scope.selectedFont = $scope.data.fontStyle; // Is an object.

	  });
	}

	$scope.batchSetConfig = function () {
			nconf.load();
			nconf.set('lastURL', $scope.lastURL);
			nconf.set('fontSize', $scope.fontSize);
			nconf.set('fontColor', $scope.fontColor);
			nconf.set('fontStyle', $scope.fontStyle);
			nconf.set('lineHeight', $scope.lineHeight);
			nconf.set('bgColor', $scope.bgColor);
			nconf.set('opacity', '100%');
			nconf.set('width', $scope.width);
			nconf.set('height', $scope.height);
			nconf.set('transparency', $scope.transparency);
			nconf.set('frame', true);
			$scope.addAFuckingFont($scope.userFonts);
			nconf.save(function (err) {
			fs.readFile('./resources/config.json', function (err, data) {
				console.dir(JSON.parse(data.toString()));
			});
		});
	}


	$scope.addAFuckingFont = function (shit) {
		var rejects = [];
		if ($scope.userFonts) {
			var output = shit.split('=')[1].split('|');
			for (i = 0; i < output.length; i++) {
				var fontID = output[i];
				var fontName = output[i].replace(/\+/g, ' ');

				var str = JSON.stringify($scope.fonts);
				if (str.indexOf(fontName) < 0) {
					var newFont = { 'name': fontName, 'id': fontID, 'type': 'user' };
						console.log(newFont);
						$scope.fonts.push(newFont);
				} else {
					rejects.push(fontName);
					console.log('REJECTED: ' + rejects);
				}
			}
			nconf.set('fonts', $scope.fonts);
		}
	}

	$scope.processGoogleFontURL = function (url) {
		console.log('HOHOHO: ' + $scope.$watch.fonts)
		var output = url.split('=')[1].split('|');
		for (i = 0; i < output.length; i++) {
			var fontID = output[i];
			var fontName = output[i].replace(/\+/g, ' ');

			var newFont = { 'name': fontName, 'id': fontID, 'type': 'user' };
			console.log(newFont)
			// $scope.fonts.push(newFont);

		}
	}

	$scope.checkForSavedURL = function () {
		if ($scope.lastURL) {
			$scope.url = $scope.lastURL;
			console.log($scope.url);
		}
	}

	$scope.switchFormColor = function (check) {
		var form = angular.element(document.querySelector('#validateForm'));
		var submitButton = angular.element(document.querySelector('#submit'));

		if (check == true) {
			form.addClass('valid');
			submitButton.addClass('valid');
			$scope.formCss = {
				'background-color': '#C8E6C9',
	  			'color': '#2E7D32'
			}
		} else {
			form.addClass('invalid');
			submitButton.addClass('invalid');
			$scope.formCss = {
				'background-color': '#FFCDD2',
	  			'color': '#C62828'
			}
		}
	}

	// Resets the form to normal colors when the user blurs or changes values.
	$scope.resetForm = function () {
		var form = angular.element(document.querySelector('#validateForm'));
		var submitButton = angular.element(document.querySelector('#submit'));

		if (!$scope.url) {
			form.removeClass('invalid valid');
			submitButton.removeClass('invalid valid');
			$scope.formCss = {
				'background-color': '#e8e8e8',
	  			'color': '#5a5a5a'
			}
			$scope.URLStatusMessage = '';
		}
	}

	$scope.checkURL = function (rawURL) {

		// If there is a saved URL, then make it the input.
		if ($scope.lastURL) {
			rawURL = $scope.lastURL;
		}

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
						$scope.switchFormColor($scope.isValidURL);
						$scope.URLStatusMessage = 'Session active.';
						if ($scope.checked) {
							setConfig('lastURL', $scope.url);
						}
						openMe([author, event, $scope.data]);
					} else {
						// URL must consist of only alphanumeric characters, hyphens, or underscores.
						$scope.isValidURL = false;
						$scope.switchFormColor($scope.isValidURL);
						$scope.URLStatusMessage = 'Sorry. The URL must consist of only alphanumeric characters, hyphens, slashes, or underscores. It must not contain any spaces.';
					}
				} else {
					$scope.isValidURL = false;
					$scope.switchFormColor($scope.isValidURL);
					$scope.URLStatusMessage = 'Sorry. The URL you have entered is invalid. It must be in the form: http://aloft.nu/stanley/eventname.';
				}
		  	} else {
		  		$scope.isValidURL = false;
		  		$scope.switchFormColor($scope.isValidURL);
		  		$scope.URLStatusMessage = 'Sorry. That is not a valid aloft.nu address.';
		  	}
	  	} else {
	  		$scope.isValidURL = false;
	  		$scope.switchFormColor($scope.isValidURL);
		  	$scope.URLStatusMessage = 'Sorry. This field cannot be left blank!';
	  	}
	  }

	$scope.loadConfig();
	$scope.checkForSavedURL();
	$scope.$watch(function() {
    	$('.selectpicker').selectpicker('refresh');
	});

});