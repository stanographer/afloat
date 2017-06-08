var myApp = angular.module('Float',[])
.factory('configService', function ($http, $q) {
	return {
		loadConfig: function () {
			return $http.get(__dirname + '/resources/config.json')
				.then(function (res) {
					if (typeof res.data === 'object') {
						return res.data;
					} else {
						// Something went wrong! No object returned!
						return $q.reject(res.data);
					}
				}, function (res) {
					return $q.reject(res.data);
				});
		}
	}
})

.controller('FloatController', function ($scope, $http, configService, $q) {
	$scope.url = '';
	$scope.configData;
	$scope.checked;
	$scope.isValidURL = false;
	$scope.URLStatusMessage = '';
	$scope.fontMessage;
	$scope.userFonts;
	$scope.selectedFont;
	$scope.testTextArray = [];
	$scope.numLinesInt = parseInt($scope.numLines);
	$scope.captionWindowHeight;
	$scope.addedFonts = [];
	$scope.rejects = [];
	$scope.formCss = {
	  'background-color': '',
	  'color': ''
	}

	// Promise to make sure config was loaded
	// before letting anything that depends on it
	// do anything.

	var wasConfigLoaded = configService.loadConfig()
		.then(function (data) {
			if (data != null) {
				// Configuration was loaded successfully.
				$scope.configData = data;
				$scope.selectedFont = $scope.configData.fontStyle;
				console.log($scope.configData)
			} else {
				$scope.URLStatusMessage = 'There was an error loading the configuration file. Please download a fresh copy of Afloat.';
			}
		}, function (error) {
			// Promise rejected.
			$scope.URLStatusMessage = 'There was an error loading the configuration file. Please download a fresh copy of Afloat.';
		});

	$q.all([wasConfigLoaded]).then(function (data) {
		console.log($scope.configData);
		var googleFontsLink = '<link href="https://fonts.googleapis.com/css?family=' + $scope.selectedFont.id + '" rel="stylesheet">';
			$('head').append(googleFontsLink);
			$('#testArea').css("font-size", $scope.configData.fontSize + 'px')
						  .css("font-family", '\'' + $scope.selectedFont.id + '\', sans-serif')
						  .css("line-height", $scope.configData.lineHeight + '%');
			for (var i = 0; i < $scope.configData.numLines; i++) {
				$scope.testTextArray.push('text ' + i);
				console.log($scope.testTextArray[i]);
			}
			$scope.selectedFont = $scope.configData.fontStyle;
			$scope.checkForSavedURL();
			if ($scope.configData.lastURL) {
				$scope.url = $scope.configData.lastURL;
			}
			angular.element(document).ready(function () {
				$scope.captionWindowHeight = $('#testArea').height();
				$scope.$apply();
			});
	});


	// Commits all config elements in settings pane to resources/config.json when save is entered.
	$scope.batchSetConfig = function () {
		    $scope.rejects = [];
			$scope.fontMessage = null;
			nconf.load();
			nconf.set('lastURL', $scope.configData.lastURL);
			nconf.set('fontSize', $scope.configData.fontSize);
			nconf.set('fontColor', $scope.configData.fontColor);
			nconf.set('fontStyle', $scope.selectedFont);
			nconf.set('lineHeight', $scope.configData.lineHeight);
			nconf.set('bgColor', $scope.configData.bgColor);
			nconf.set('opacity', '100%');
			nconf.set('width', $scope.configData.width);
			nconf.set('height', $scope.configData.height);
			nconf.set('numLines', $scope.configData.numLines);
			nconf.set('transparency', $scope.configData.transparency);
			nconf.set('allWorkspaces', $scope.configData.allWorkspaces);
			nconf.set('shadow', $scope.configData.shadow);
			nconf.set('frame', true);
			$scope.addAFuckingFont($scope.userFonts);
			nconf.save(function (err) {
			fs.readFile(__dirname + '/resources/config.json', function (err, data) {
				if (err) {
					console.log('Could not save!');
					alert('There was an error.');
				} else {
					console.log('Saved successfully!')
					console.dir(JSON.parse(data.toString()));
					alert('Configuration was saved successfully!');
				}
			});
		});
	}
	
	// Lets the user add custom fonts from Google Fonts.
	$scope.addAFuckingFont = function (shit) {
		if ($scope.userFonts) {
			// Check to make sure there's a URL and that it's a valid Google Fonts URL.
			if ($scope.userFonts.indexOf('https://fonts.googleapis.com/css?family=') > 0) {
			// Check to see if the pasted content is a Google Fonts HTML snippet.
			if (shit.indexOf('href=') > 0) {
				var htmlSnippet = shit.trim().split('<link href="')[1].split('" rel="stylesheet">')[0];
				console.log(htmlSnippet);
				// Now make the variable just the pure URL.
				shit = htmlSnippet;
			}
			// Separate out the components of the URL.
			var output = shit.split('=')[1].split('|');
			for (i = 0; i < output.length; i++) {
				var fontID = output[i];
				var fontName = output[i].replace(/\+/g, ' ');

				var str = JSON.stringify($scope.configData.fonts);
				// Make sure there are not duplicates.
				if (str.indexOf(fontName) < 0) {
					var newFont = { 'name': fontName, 'id': fontID, 'type': 'user' };
					$scope.addedFonts.push(fontName);
						console.log(newFont);
						$scope.configData.fonts.push(newFont);
				} else {
					$scope.rejects.push(fontName);
				}
			}
			nconf.set('fonts', $scope.configData.fonts);
			} else {
				$scope.fontMessage = 'That is not a valid Google Fonts HTML snippet or URL.';
			}
		}
	}

	$scope.processGoogleFontURL = function (url) {
		console.log('HOHOHO: ' + $scope.$watch.fonts);
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
		if ($scope.configData.lastURL && $scope.configData.lastURL == $scope.url) {
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
		var author;
		var event;

		// If there is a saved URL, then make it the input.
		if ($scope.url == $scope.configData.lastURL) {
			rawURL = $scope.configData.lastURL;
		} else {
			rawURL = $scope.url;
		}

	  	// Regex for invalid characters.
	  	var regexp  = /^[-\w]+$/;

	  	// Check to make sure isn't null.
	  	if (!rawURL == '' || !$scope.url == '') {

	  		// Turn user input into all lower and trim whitespace.
	  		var cleanURL = rawURL.toLowerCase().trim();

	  		// Makes sure it's an Aloft address (contains aloft.nu).
		  	if (cleanURL.includes('aloft.nu/')) {

		  		// Removes "http://" and "aloft.nu/."
		  		var cleanURL = cleanURL.replace(/.*?:\/\//g, '').replace(/aloft.nu\//g, '');

		  		// If there are more than 2 slashes, make sure it contains "events."
		  		if (cleanURL.split('/').length <= 3 && cleanURL.includes('events/')) {

		  			// In which case, make the URL the part that comes after.
			  		cleanURL = cleanURL.split('events/')[1];
			  		console.log('stdstrdstrdstdstBAHHHH: ' + cleanURL)
			  		console.log('numbaa: ' + cleanURL.split('/')[0])
		  		} else {

		  			// Makes sure there are only two "parts" to the URL.
		  			if (cleanURL.split('/').length != 2) {

		  				// If it's not true, set false so it fails at next step.
		  				cleanURL = '';
		  			}
		  		}
		  		// Divides result into author name and event name.
				author = cleanURL.split('/')[0];
				event = cleanURL.split('/')[1];

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
						openMe([author, event, $scope.configData, $scope.captionWindowHeight]);
					} else {
						// URL must consist of only alphanumeric characters, hyphens, or underscores.
						$scope.isValidURL = false;
						$scope.switchFormColor($scope.isValidURL);
						$scope.URLStatusMessage = 'Sorry. The URL must consist of only alphanumeric characters, hyphens, slashes, or underscores. It must not contain any spaces.';
					}
				} else {
					$scope.isValidURL = false;
					$scope.switchFormColor($scope.isValidURL);
					$scope.URLStatusMessage = 'Sorry. The URL you have entered is invalid. It must be in the form: aloft.nu/CAPTIONER/EVENT or aloft.nu/events/CAPTIONER/EVENT.';
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

	// $scope.loadConfig();
	// $scope.makeTestTextArray();
	$scope.$watch(function() {
    	$('.selectpicker').selectpicker('refresh');
	});

});