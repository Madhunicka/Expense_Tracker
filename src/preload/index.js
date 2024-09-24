import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  openPopup: () => {
    ipcRenderer.send('open-popup');
  },
  getExpenses: async () => {
    return await ipcRenderer.invoke('get-expenses');
  },
  addExpense: (expenseData) => ipcRenderer.invoke('addExpense', expenseData),
  
  on: (eventName, callback) => ipcRenderer.on(eventName, callback),
  off: (eventName, callback) => ipcRenderer.off(eventName, callback)
};

contextBridge.exposeInMainWorld('api', api);


// Use `contextBridge` APIs to expose Electron APIs to renderer only if context isolation is enabled
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // Fallback for non-isolated context (not recommended for security reasons)
  window.electron = electronAPI;
  window.api = api;
}
