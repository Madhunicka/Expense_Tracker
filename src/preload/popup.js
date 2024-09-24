// If you have popup-specific logic, include it here
import { contextBridge, ipcRenderer } from 'electron';

// You can add popup-specific APIs if needed
contextBridge.exposeInMainWorld('popupApi', {
  addExpense: (expenseData) => ipcRenderer.invoke('addExpense', expenseData)
});

const popupAPI = {};

// Use `contextBridge` APIs to expose Electron APIs to renderer only if context isolation is enabled
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('popupApi', popupAPI);
  } catch (error) {
    console.error(error);
  }
}
