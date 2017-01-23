const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const ew = require('electron-window');

const path = require('path');
const url = require('url');

let mainWindow;
let eventData;
let win;

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
  mainWindow.setResizable(false);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  });
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
  win = new BrowserWindow({
    width: 1000,
    height: 200,
    // titleBarStyle: 'hidden',
    transparent: true,
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
  win.close();
  mainWindow.close();
  app.quit();
});

ipcMain.on('settings', () => {
  let settingsPane = new BrowserWindow({
    width: 350,
    height: 500
  });
  settingsPane.loadURL(`file://${__dirname}/settings.html`);
});