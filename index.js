const { app, BrowserWindow, nativeImage, globalShortcut } = require('electron');

const APPICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAiJJREFUWEdjZBhgwDjA9jMMTgfkNm38zsjAwIEROv8Z2ifV+1cRCrW8po3/samZVOeP4WEMAVyaYQYyMjL6Tqz124LLEYT0ozsCpwPqpCIx7Gh6thwshs0nIPG8po0ZDAwM09NE2hgk2C6j6MelF9MBjRvWMDAyBheKlzLwMj8hyhCYIpjvSXE81kSIy6CXv7UZZr6uYfjPwFA7uc6/BT2IcOnDF3IkOQBkIS7Dchs3RjMyMiyJFZrIoMhxguiQw+qAjJbN0mz//j3R4rjCECLUSpRh5AQ/yGCc5QAuA3/942XoeDGLgYHh/9pJdQEhhOKfUMIl2QHYoiG/ZaPd/38MB4ME5jDocO0lKsTg2RpfoUJsoiI3+PFGATRfg0s0XNnqP8P/h5PrAhSIdSg2z+KtC4jxGcM/Zl0Gpr+XPfhWMpjxbCAp+AmGAL5QgCUumI3oofTxjzzDxFcdDP///185uT4gAldUE6wNiQoFLNFEKPUTlQiJSQcgNbY82xkc+RaRHPxERQEx0YAe/Cvf1jPc/KnB8O0Hg8ScNv+X+HIawSggJhTQHUBs8JMQAps2MTD89y0WL2TgZn6B4qFtH3IYvASmkBX8RDuAUCgg206K74eWA3KaNyky/f9/T4/zAkOAYCfOdEWzECAmGki1nKQoGBQOIOQImocAsgNwJQJcLWay6wJsGnG1/f/9YlSa0uJ3H1/Jhy5HVElIioGkqh11AACQYjUw+9rFtwAAAABJRU5ErkJggg==";

if (!app.requestSingleInstanceLock()) {
    app.exit(0);
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        icon: nativeImage.createFromDataURL(APPICON),
        width: 1200,
        height: 800,
        autoHideMenuBar: true,
        resizable: true,
        alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');
    //mainWindow.loadURL('https://nimadez.github.io/voxel-builder');

    const reload = ()=> mainWindow.reload();
    const devTools = ()=> mainWindow.webContents.toggleDevTools();
    const register = ()=> {
        globalShortcut.register('f5', reload);
        globalShortcut.register('f1', devTools);
    };
    const unregister = ()=> {
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
