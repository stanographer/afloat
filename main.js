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
    show: false,
    width: 400,
    height: 710,
    titleBarStyle: 'hidden-inset'
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindow.setMaximizable(false);
  mainWindow.setFullScreenable(false);
  mainWindow.once('ready-to-show', () => {
   mainWindow.show();
  });
  // mainWindow.on('close', function () {
  //   settingsPane.close();
  // });
  // mainWindow.setResizable(false);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('close', function () {
     app.quit();
  });
}

// var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
//   // Someone tried to run a second instance, we should focus our window.
//   if (mainWindow) {
//     if (mainWindow.isMinimized()) mainWindow.restore();
//     mainWindow.focus();
//   }
// });

// if (shouldQuit) {
//   app.quit();
//   return;
// }

ipcMain.on('start-event', (event, args) => {
  // Automatically calculates the window height based on no of lines.
  var windowHeight = parseInt(args[3]);
  win = new BrowserWindow({
    width: 1000,
    height: windowHeight,
    transparent: false,
    transparent: args[2].transparency,
    frame: false,
    overlayFullscreenVideo: true
  });
  win.setAlwaysOnTop(true, 'status');
  win.setHasShadow(args[2].shadow);
  win.setVisibleOnAllWorkspaces(args[2].allWorkspaces);
  win.center();
  win.loadURL(`file://${__dirname}/captions.html`);
  win.webContents.openDevTools();
  eventData = args;
  win.on('close', function (data) {
    win.hide();
    data.preventDefault();
    if (!mainWindow.isDestroyed()) {
      mainWindow.reload();
    }
  });
});

ipcMain.on('did-finish-loading', function () {
  win.webContents.send('event-data', eventData);
});

ipcMain.on('settings', () => {
  settingsPane = new BrowserWindow({
    width: 350,
    height: 700,
    titleBarStyle: 'hidden-inset'
  });
  settingsPane.loadURL(`file://${__dirname}/settings.html`);
  settingsPane.focus();
  settingsPane.setFullScreenable(false);
  settingsPane.setMaximizable(false);
  settingsPane.on('close', function (data) {
    mainWindow.reload();
  });
  // settingsPane.setResizable(false);
  // settingsPane.webContents.openDevTools();
});

ipcMain.on('close-settings', () => {
  settingsPane.close();
});

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
    if (win) {
      win.removeAllListeners('close');
    }
    if (settingsPane) {
      settingsPane.removeAllListeners('close');
    }
    mainWindow.removeAllListeners('close');
});
