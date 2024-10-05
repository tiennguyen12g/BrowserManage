import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';
import { ParamForCommands, SizeType, } from './Interface/ParamType';
import { exec } from "child_process";
import { EventEmitter } from 'events';


/**Puppeteer */
import { Profile_Puppeteer_Type, Puppeteer_Connect_Profile, setWindowBounds } from './Backend/Puppeteer/Puppeteer_Connect_Profile';
import { useGetChromeProfiles, UpdateProfileType } from './Backend/Puppeteer/Puppeteer_State.zustand';

// Create a variable store profile instance.

const emitter = new EventEmitter();
let chromeProfiles: { [key: string]: Profile_Puppeteer_Type } = {};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

/**
 * @Create the browser window.
 */
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    
  }
});


/**
 * @Get screen size 
 */
ipcMain.handle("get-screen-size", () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  return { width, height };
});

/**
 * @Launch profile by command
 */
ipcMain.handle("call-open-profile-by-command",((event: any, params: ParamForCommands) =>{
  const  {
    port,
    profileName, profilePath,
    width, height,
    posX, posY,
    openUrl,
  } = params;

  const batFilePath = path.join(__dirname,"BatCommand","call_open_profile.bat");

  exec(`"${batFilePath}" "${port}" "${profileName}" "${profilePath}" "${width}" "${height}" "${posX}" "${posY}" "${openUrl}"`,
    async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        event.sender.send("response-open-profile-by-command", {
          success: false,
          message: {
            message: `Error: ${error}`,
            profileName: profileName,
          },
        });
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        event.sender.send("response-open-profile-by-command", {
          success: false,
          message: {
            message: `Stderr: ${stderr}`,
            profileName: profileName,
          },
        });
        return;
      }
      console.log("Success open profile by command")
      console.log(`Stdout: ${stdout}`);
      event.sender.send("response-open-profile-by-command", {
        success: true,
        message: {
          message: `Profile ${profileName} is opening. Stdout: ${stdout}`,
          profileName: profileName,
        },
      });
      const newParam = {...params,emitter}
      const profile: Profile_Puppeteer_Type = await Puppeteer_Connect_Profile(newParam);
      console.log('Success connect profile with puppeteer');
      chromeProfiles[profileName] = profile;
      // const updateProfile: UpdateProfileType[] = [
      //   {
      //     profile: profile,
      //     profileName: profileName,
      //   }
      // ]
      // updateChromeProfiles(updateProfile,"add", [])
      console.log('chromeProfiles',chromeProfiles);

      // detect user close profile outside
      profile.browser.on('disconnected', () => {
        delete chromeProfiles[profileName];
        event.sender.send('response-puppeteer-close-profile',{
          success: true,
          message: {
            message: `Profile ${profileName} was closed.`,
            profileName: profileName,
          },
        });
      });
    }
  );
}))

/**
 * @Use Puppeteer to close profile
 */
ipcMain.handle("call-puppeteer-close-profile", async (event, profileName: string) =>{
  console.log('profileName',profileName);
  // console.log('chromeProfiles',chromeProfiles);

  const profile = chromeProfiles[profileName];
  if (profile) {
    await profile.browser.close();
    delete chromeProfiles[profileName];
    // updateChromeProfiles([],"delete",[profileName])
    event.sender.send('response-puppeteer-close-profile',{
        success: true,
        message: {
          message: `Profile ${profileName} was closed.`,
          profileName: profileName,
        },
    });
  } else {
    event.sender.send('response-puppeteer-close-profile', { 
      success: false,
      message: {
        message: `Profile ${profileName} was not found.`,
        profileName: profileName
      },
     });
  }
})


/**
  *@ Change window size 
  */
ipcMain.handle("call-apply-new-window-size",async (event, params: SizeType) =>{
  const {width, height} = params;

  const arrayProfile = Object.keys(chromeProfiles);
  try {
    for (const profileName of arrayProfile){
      const page = chromeProfiles[profileName].page;
      await setWindowBounds(page, width, height);
      event.sender.send("response-apply-window-size", {
        success: true,
        message: {
          message: `Window resize successfully`,
          profileName: profileName,
        },
      });
    }
  } catch (error) {
    console.log('apply window size error', error);
  }
})

/**
 * @Receive captured events and broadcast event to other profile. Profile_1 is main.
 */
const eventStore:{[key: string]: any} = {}
emitter.on('capture-event', async (data: any) => {
  console.log('Received capture event in main:', data);  // Debug log
  const { eventName, details } = data;
  const arrayProfile = Object.keys(chromeProfiles);
  await broadcastEvent(arrayProfile, eventName,details)
  const count = emitter.listenerCount('capture-event');
  console.log('count',count);
});

async function broadcastEvent(arrayProfile: string[], eventName: string, details: any){
  for (const profileName of arrayProfile) {
    if (profileName !== 'Profile_1') {
      const page = chromeProfiles[profileName].page;
      if(eventName === "click"){
        page.mouse.click(details.x, details.y);
        console.log('browser 2 click');
      }
      if (eventName === 'input') {
        const inputValue = details.inputValue;
        console.log('inputValue', inputValue);
        page.keyboard.type(`${inputValue}`, {delay: 500})
        console.log('browser 2 input');
      }
      if(eventName === "keypress"){
        const keyValue = details.key;
        if(keyValue === "Enter"){
          console.log('enter', keyValue);
          await page.keyboard.press("Enter")
          console.log('browser 2 keypress');
        }
      }
      if (eventName === "keydown" ) {
        const keyValue = details.key;
        page.keyboard.press(keyValue);
        console.log('browser 2 keydown');
      }
      if(eventName === "scroll"){
        const scrollX = details.scrollX;
        const scrollY = details.scrollY;
        // await page.mouse.move(scrollX, scrollY);
        await page.evaluate((scrollX, scrollY) => {
          window.scrollTo(scrollX, scrollY);  // Perform the actual scroll
        }, scrollX, scrollY);
      }
      if(eventName === "mousemove"){
        await page.mouse.move(details.moveX, details.moveY)
      }
    }
  }
}