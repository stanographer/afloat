const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const ew = require('electron-window');

const path = require('path');
const url = require('url');

let mainWindow;
let eventData;
let win;
let settingsPane;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 710,
    frame: false,
    titleBarStyle: 'hidden-inset'
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindow.setMaximizable(false);
  mainWindow.setFullScreenable(false);
  // mainWindow.setResizable(false);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (shouldQuit) {
  app.quit();
  return;
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('start-event', (event, args) => {
  console.log('hit main: ' + JSON.stringify(args, null, 2) + ' ' + JSON.stringify(args[2], null, 2));
  win = new BrowserWindow({
    width: 1000,
    height: 200,
    titleBarStyle: 'hidden',
    transparent: false,
    frame: false
  });
  win.setAlwaysOnTop(true, 'status');
  // win.setHasShadow(false);
  // win.center();
  win.loadURL(`file://${__dirname}/captions.html`);
  win.webContents.openDevTools();
  eventData = args;
});

ipcMain.on('did-finish-loading', function () {
  win.webContents.send('event-data', eventData);
});

ipcMain.on('end-session', (event, args) => {
  app.quit();
});

ipcMain.on('settings', () => {
  settingsPane = new BrowserWindow({
    width: 350,
    height: 700,
    titleBarStyle: 'hidden'
  });
  settingsPane.loadURL(`file://${__dirname}/settings.html`);
  settingsPane.focus();
  settingsPane.setFullScreenable(false);
  settingsPane.setMaximizable(false);
  // settingsPane.setResizable(false);
  settingsPane.webContents.openDevTools();
});
ipcMain.on('close-settings', () => {
  settingsPane.close();
});