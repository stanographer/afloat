const {remote, ipcRenderer, Menu} = require('electron');
const main = remote.require('./main.js');
const nconf = require('nconf');
const fs = require('fs');
// const configuration = JSON.parse(fs.readFileSync('./resources/config.json'));

// var saveData = JSON.stringify(propz);

// nconf.use('file', { file: './config.json' });
//   nconf.load();

function saveFirst (data) {
	var defaults = {
		lastURL: '',
		fontSize: '20',
		fontColor: '#fff',
		fontStyle: 'Open Sans',
		bgColor: '#000',
		opacity: '100%',
		width: '800',
		height: '50'
	};
	var saveDefaults = JSON.stringify(defaults);
	console.log(defaults);
	fs.writeFile('./resources/config.json', saveDefaults, function (err) {
		if (err) {
			console.log('There was an error saving configuration!');
		} else {
			console.log('Configuration saved successfully!')
		}
	});
}

function openMe(data) {
	console.log('WTF ' + data);
	ipcRenderer.send('start-event', data);
}

function endSession(data) {
	ipcRenderer.send('end-session');
}
function settings() {
	ipcRenderer.send('settings');
}