const {remote, ipcRenderer, Menu} = require('electron');
const main = remote.require('./main.js');
const nconf = require('nconf');
const fs = require('fs');
const configuration = JSON.parse(fs.readFileSync('./resources/config.json'));

nconf.argv()
	.env()
	.file({ file: './resources/config.json'});

function saveFirst (data) {
	var defaults = {
		lastURL: '',
		fontSize: '40px',
		fontColor: '#fff',
		fontStyle: { name: 'Sanchez', id: 'Sanchez', type: 'default' },
		lineHeight: '140%',
		bgColor: '#2c363f',
		opacity: '100%',
		width: '800',
		height: '50',
		transparency: false,
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

function openMe(data) {
	console.log('WTF ' + JSON.stringify(data, null, 2));
	ipcRenderer.send('start-event', data);
}

function endSession(data) {
	ipcRenderer.send('end-session', data);
}
function settings(data) {
	ipcRenderer.send('settings', data);
}