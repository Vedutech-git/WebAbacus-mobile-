const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700
  });

  win.loadFile('index.html'); // your HTML file
}

app.whenReady().then(createWindow);