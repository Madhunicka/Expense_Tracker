import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import fs from 'fs'; 
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    resizable:false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  //open small popupwindow open-popup
 

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('addExpense', async (event, expenseData) => {
  const dbPath = is.dev 
    ? join(__dirname, '../db/expenses.json')
    : join(app.getPath('userData'), 'expenses.json');

  let expenses = [];
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf-8');
    expenses = JSON.parse(data).expenses || [];
  }

  expenses.push(expenseData);
  fs.writeFileSync(dbPath, JSON.stringify({ expenses }, null, 2));

  // Send the updated expenses to the renderer
  mainWindow.webContents.send('expenses-updated', expenses);
});




// Open small popup window when 'open-popup' event is received

//open small popupwindow open-popup
// Open small popup window when 'open-popup' event is received
ipcMain.on('open-popup', () => {
  const popupWindow = new BrowserWindow({
    width: 400,
    height: 580,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // Ensure this path is correct
      sandbox: false,
      contextIsolation: true,
      
    },
  });

  // Set the correct path to popup.html for dev and production
  const popupURL = is.dev && process.env.ELECTRON_RENDERER_URL
    ? `${process.env.ELECTRON_RENDERER_URL}/popup.html`
    : `file://${join(__dirname, '../renderer/popup.html')}`;

  popupWindow.loadURL(popupURL).catch((err) => {
    console.error('Failed to load popup:', err);
  });

  popupWindow.once('ready-to-show', () => {
    popupWindow.show();
  });
  
});

ipcMain.handle('get-expenses', async (event) => {
  const dbPath = is.dev 
    ? join(__dirname, '../db/expenses.json')
    : join(app.getPath('userData'), 'expenses.json');

  console.log('Database Path:', dbPath); // Log to verify the path

  let expenses = [];
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf-8');
    expenses = JSON.parse(data).expenses || []; // Ensure it returns an empty array if no expenses
  } else {
    console.warn('Database file does not exist:', dbPath); // Log warning if file doesn't exist
  }

  // Emit an event to notify that expenses have been fetched
  event.sender.send('expenses-fetched', expenses);

  return expenses; // Return expenses to the caller
});











// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
