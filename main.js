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
    height: 690,
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
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('start-event', (event, args) => {
  console.log(args[0]);
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