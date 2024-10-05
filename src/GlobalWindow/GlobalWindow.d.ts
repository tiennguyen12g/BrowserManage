import { ParamForCommands } from "src/Interface/ParamType";
import { CaptureEvent_Type } from "src/Puppeteer/Puppeteer_Connect_Profile";
import { v4 as uuidv4 } from 'uuid';
import { Detect_Enter } from './WindowFunction/KeyboardDetect';
export interface IElectronAPI {

    call_open_profile_by_command: (params: ParamForCommands) => Promise<void>;
    response_open_profile_by_command: (callback:any) => Promise<void>;

    getScreenSize: () => Promise<{ width: number; height: number }>;
    generateUUID: () => void;

    call_puppeteer_close_profile: (profileName: string) => Promise<void>;
    response_puppeteer_close_profile: (callback: any) => Promise<void>;

    call_apply_new_window_size: (newSize: SizeType ) => Promise<void>;
    response_apply_window_size : (callball: any) => Promise<void>;
    handleEnter: (callback: any) => Promise<void>;
}

declare global {
    interface Window {
      electronAPI: IElectronAPI;
      logEvent:(eventName: string, details: any) => Promise<void>;
      dragDropEvent:(details: any) => Promise<void>;
    }
}
  