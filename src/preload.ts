// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer,  } from "electron";
// Type
import { ParamForCommands, SizeType ,} from "./Interface/ParamType";
import { v4 as uuidv4 } from 'uuid';


contextBridge.exposeInMainWorld("electronAPI", {
    call_open_profile_by_command: (params: ParamForCommands) => ipcRenderer.invoke('call-open-profile-by-command', params),
    response_open_profile_by_command: (callback:any) => ipcRenderer.on('response-open-profile-by-command', callback),

    getScreenSize: () => ipcRenderer.invoke("get-screen-size"),

    generateUUID: () => uuidv4(),


  /**
   * @puppeteer api
   */
  // create/open
  call_puppeteer_create_profile: (params: any) => ipcRenderer.invoke('call-puppeteer-create-profile', params),
  response_puppeteer_create_profile: (callback: any) => ipcRenderer.on('response-puppeteer-create-profile', callback),
  // close browser
  call_puppeteer_close_profile: (profileName: string) => ipcRenderer.invoke('call-puppeteer-close-profile', profileName),
  response_puppeteer_close_profile: (callback: any) => ipcRenderer.on('response-puppeteer-close-profile', callback),

  // change window size
  call_apply_new_window_size: (newSize: SizeType ) => ipcRenderer.invoke("call-apply-new-window-size", newSize),
  response_apply_window_size : (callback: any) => ipcRenderer.on("response-apply-window-size", callback),

  // drag-drop event
  // call_drap_drop: () => 
    handleEnter: (callback: any) => {
      window.addEventListener('keydown', (event) => {
        console.log('down');
          if (event.key === 'Enter') {
            console.log('Enter key was pressed', event);
            callback();
          }
      });
  },
})