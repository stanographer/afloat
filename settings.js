function clearTextInput (id) {
	document.getElementById(id).value = "";
}

function closeSettings (data) {
	ipcRenderer.send('close-settings', data);
}

function setDefaults (data) {
	var defaults = {
		lastURL: '',
		fontSize: '40',
		fontColor: 'FFF',
		fontStyle: { name: 'Asap', id: 'Asap', type: 'default' },
		lineHeight: '110',
		bgColor: '2C363F',
		opacity: '100%',
		width: '800',
		height: '50',
		numLines: '3',
		transparency: true,
		shadow: false,
		allWorkspaces: false,
		frame: true,
		userFonts: [],
		fonts: [
			{ name: 'Asap', id: 'Asap', type: 'default' },
			{ name: 'Avenir Next', id: 'Avenir+Next', type: 'default' },
			{ name: 'Inconsolata', id: 'Inconsolata', type: 'default' },
			{ name: 'Lato', id: 'Lato', type: 'default' },
			{ name: 'Open Sans', id: 'Open+Sans', type: 'default' },
			{ name: 'Raleway', id: 'Raleway', type: 'default' },
			{ name: 'Sanchez', id: 'Sanchez', type: 'default' },
			{ name: 'Source Sans Pro', id: 'Source+Sans+Pro', type: 'default' },
			{ name: 'Varela Round', id: 'Varela+Round', type: 'default' }
		]
	}

	var saveDefaults = JSON.stringify(defaults, null, 2);

	fs.writeFile(__dirname + '/resources/config.json', saveDefaults, function (err) {
		if (err) {
			console.log('There was an error saving configuration!');
			alert('There was an error saving configuration!');
		} else {
			console.log('Configuration saved successfully!');
			alert('Configuration saved successfully!');
		}
	});
}

function setConfig (key, value) {
	nconf.load();
	nconf.set(key, value);
	nconf.save(function (err) {
		fs.readFile(__dirname + '/resources/config.json', function (err, data) {
			console.dir(JSON.parse(data.toString()));
		});
	});
}