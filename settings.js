function clearTextInput (id) {
	document.getElementById(id).value = "";
}

function closeSettings (data) {
	ipcRenderer.send('close-settings', data);
}

function setDefaults (data) {
	var defaults = {
		lastURL: '',
		fontSize: '40px',
		fontColor: '#fff',
		fontStyle: 'Open Sans',
		bgColor: '#2c363f',
		opacity: '100%',
		width: '800',
		height: '50',
		transparency: false,
		frame: true,
	};

	var saveDefaults = JSON.stringify(defaults, null, 2);
	console.log(defaults);
	fs.writeFile('./resources/config.json', saveDefaults, function (err) {
		if (err) {
			console.log('There was an error saving configuration!');
		} else {
			console.log('Configuration saved successfully!')
		}
	});
	location.reload();
}

function setConfig (key, value) {
	nconf.load();
	nconf.set(key, value);
	nconf.save(function (err) {
		fs.readFile('./resources/config.json', function (err, data) {
			console.dir(JSON.parse(data.toString()));
		});
	});
}