// Aug 2019 https://nimadez.github.io/
// Voxel Builder Electron

if (!require('electron').app.requestSingleInstanceLock())
    require('electron').app.exit(0);

const { app, BrowserWindow, Menu } = require('electron');

function createWindow() {
    const mainWindow = new BrowserWindow({
        icon: './src/assets/appicon.png',
        width: 1200,
        height: 900,
        autoHideMenuBar: true,
        resizable: true,
        alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: false
        }
    });

    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        details.responseHeaders['Cross-Origin-Opener-Policy'] = ['same-origin'];
        details.responseHeaders['Cross-Origin-Embedder-Policy'] = ['require-corp', 'credentialless'];
        callback({ responseHeaders: details.responseHeaders });
    });

    mainWindow.loadFile('src/index.html');

    Menu.setApplicationMenu(Menu.buildFromTemplate([
        { 
            label: "Reload",
            accelerator: "f5",
            click() {
                mainWindow.reload();
            }
        }, {
            label: "DevTools",
            accelerator: "f1",
            click() {
                mainWindow.webContents.toggleDevTools();
            }
        }
    ]));

    mainWindow.webContents.on('devtools-opened', () => {
        mainWindow.webContents.focus();
    });
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
