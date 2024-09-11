// Aug 2019 https://nimadez.github.io/
// Voxel Builder Electron

if (!require('electron').app.requestSingleInstanceLock())
    require('electron').app.exit(0);

const { app, BrowserWindow, globalShortcut } = require('electron');

function createWindow() {
    const mainWindow = new BrowserWindow({
        icon: './src/assets/appicon.png',
        width: 1200,
        height: 800,
        autoHideMenuBar: true,
        resizable: true,
        alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: false
        }
    });

    // Enable SharedArrayBuffer for three-gpu-pathtracer setSceneAsync()
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        details.responseHeaders['Cross-Origin-Opener-Policy'] = ['same-origin'];
        details.responseHeaders['Cross-Origin-Embedder-Policy'] = ['require-corp'];
        callback({ responseHeaders: details.responseHeaders });
    });

    mainWindow.loadFile('src/index.html');
    mainWindow.removeMenu();

    const reload = () => mainWindow.reload();
    const devTools = () => mainWindow.webContents.toggleDevTools();
    const register = () => {
        globalShortcut.register('f5', reload);
        globalShortcut.register('f1', devTools);
    };
    const unregister = () => {
        globalShortcut.unregister('f5', reload);
        globalShortcut.unregister('f1', devTools);
    }
    mainWindow.on('focus', register);
    mainWindow.on('blur', unregister);
    mainWindow.on('beforeunload', unregister);
    mainWindow.on('closed', () => {});
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
