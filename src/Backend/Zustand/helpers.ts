import { UseBoundStore } from 'zustand/esm';
import { StoreApi } from 'zustand';
import type { ElectronSyncOptions } from './middleware';

export function getSerializableState(excludes: string[], state: unknown) {
  return JSON.parse(
    JSON.stringify(state, (key, value) => {
      if (typeof value === 'function' || excludes.includes(key)) {
        return undefined;
      }
      return value;
    })
  );
}

function receiveStateFromMain<T>(
  store: StoreApi<T>,
  options: ElectronSyncOptions
) {
  if (typeof window !== 'undefined') {
    window.electron.ipcRenderer.on<{
      key: string;
      state: Awaited<typeof store.getState>;
    }>('zustand-sync-renderer', ({ key, state }) => {
      if (key === options.key) {
        store.setState(state);
      }
    });
  }
}

function sendStateToMain<T>(excludes: string[], get: () => T, key: string) {
  try {
    const rawState = getSerializableState(excludes, get());

    window.electron.ipcRenderer.sendMessage('zustand-sync', {
      key,
      state: rawState,
    });
  } catch (error) {
    console.error(error);
  }
}

function sendStateToRenderer<T>(excludes: string[], get: () => T, key: string) {
  try {
    const rawState = getSerializableState(excludes, get());
    // eslint-disable-next-line global-require
    const { BrowserWindow } = require('electron');
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.webContents) {
        win.webContents.send('zustand-sync-renderer', {
          key,
          state: rawState,
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function receiveStateFromRenderer(store: UseBoundStore<StoreApi<unknown>>) {
  if (typeof window !== 'undefined')
    throw new Error('This function is for main process only');

  // eslint-disable-next-line global-require
  const { ipcMain } = require('electron');

  // const listeners = ipcMain.listenerCount('zustand-sync');
  // if (listeners !== 0) return;

  ipcMain?.on('zustand-sync', (_, args) => {
    const { state, key } = args[0];
    if (store.key === key) {
      store.setState(state);
    }
  });
}

export {
  receiveStateFromMain,
  receiveStateFromRenderer,
  sendStateToMain,
  sendStateToRenderer,
};