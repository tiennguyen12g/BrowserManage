// Library
import puppeteer, { Browser, Page } from "puppeteer";
import { promisify } from "util";
import { exec } from "child_process";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
// import { EventEmitter } from 'events';
// import { EventEmitter } from "puppeteer";
// Type
interface Profile_Puppeteer_Type {
  browser: Browser;
  page: Page;
}
interface Response_Type_By_Puppeteer {
  success: boolean;
  message: {
    message: string;
    profile: Profile_Puppeteer_Type;
  };
}
interface CaptureEvent_Type {
  eventName: string;
  details: any;
}
// const emitter = new EventEmitter();
import { ParamForCommands } from "src/Interface/ParamType";
interface Puppeteer_Connect_Profile_Props extends ParamForCommands {
  emitter: any;
}

// Get wsUrl
const execPromise = promisify(exec);

async function getWsEndpoint(port: number) {
  const { stdout } = await execPromise(
    `curl http://localhost:${port}/json/version`
  );
  const versionData = JSON.parse(stdout);
  console.log("wsURL:", versionData.webSocketDebuggerUrl);
  return versionData.webSocketDebuggerUrl;
}
async function Puppeteer_Connect_Profile({
  port,
  profileName,
  // profilePath,
  width,
  height,
  posX,
  posY,
  openUrl,
  emitter,
}: Puppeteer_Connect_Profile_Props) {
  try {
    const wsEndpoint = await getWsEndpoint(port);

    // connect current page by wsURL
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });

    // Get the list of all open pages (tabs)
    const pages = await browser.pages();
    let page: Page;
    if (pages.length > 0) {
      // Use the first tab if it exists
      page = pages[0];
    } else {
      // Open a new page if no tabs are available
      page = await browser.newPage();
    }
    await setWindowBounds(page, width, height);
    // detect the browser close.
    browser.on("disconnected", () => {
      console.log(`Profile ${profileName} was closed`);
    });

    //**Capture behavior event on browser */
    // Add event listeners log to window
    await page.exposeFunction("logEvent", async (eventName: any, details: any) => {
        console.log(`${profileName}: ${eventName}:`, details);
        const data: CaptureEvent_Type = {
          eventName: eventName,
          details: details,
        };
        console.log("emit-success, eventCount:", uuidv4());
        emitter.emit("capture-event", data);
      }
    );

    await page.exposeFunction("dragDropEvent", async (details: any) => {
      console.log('details:', details);
    })

    // All behavior on browser
    async function captureBehaviorEvent() {
      // Function to set up event listeners in the browser context
      window.addEventListener("click", async (event: MouseEvent) => {
        // console.log('2');
        // event.stopPropagation();
        event.preventDefault();
        console.log("1");
        const objEvent = {
          x: event.clientX,
          y: event.clientY,
          element: (event.target as HTMLElement).tagName,
          // id: window.electronAPI.generateUUID
        };
        console.count("window-click");
        window.logEvent("click", objEvent);
      }, true);

      window.addEventListener('mousemove', (event: MouseEvent) => {
        event.preventDefault();
        const mouseX = event.clientX; // X coordinate of the mouse relative to the viewport
        const mouseY = event.clientY; // Y coordinate of the mouse relative to the viewport
        console.log(`Mouse moved to: (${mouseX}, ${mouseY})`);
        console.count('mouse-move');
        window.logEvent("mousemove",{moveX: mouseX, moveY: mouseY})
      });
      
      // document.addEventListener("keypress", (event: KeyboardEvent) => {
      //   console.log('event press', event);
      //   if (!event.repeat) {
      //     console.log(`Key "${event.key}" pressed [event: keypress]`);
      //   } else {
      //     console.log(`Key "${event.key}" repeating [event: keypress]`);
      //   }
      //   window.logEvent("keypress", {
      //     key: event.key,
      //     code: event.code,
      //   });

      // });

      window.addEventListener("keydown", (event: KeyboardEvent) => {
        if (!event.repeat) {
          console.log(`Key "${event.key}" pressed [event: keydown]`);
        } else {
          console.log(`Key "${event.key}" repeating [event: keydown]`);
        }
        window.logEvent("keydown", {
          key: event.key,
          code: event.code,
        });
      }, true);

      document.addEventListener("drop", (event: DragEvent) => {
        event.preventDefault();
        const dropX = event.clientX;
        const dropY = event.clientY;
        const details = {x:dropX, y: dropY}
        console.log("x, y", dropX, dropY);
        window.dragDropEvent(details)
      });

      // window.addEventListener("keyup", (event: KeyboardEvent) => {
      //   window.logEvent("keyup", {
      //     key: event.key,
      //     code: event.code,
      //   });
      // });

      window.addEventListener("scroll", (e: any) => {
        window.logEvent("scroll", {
          scrollX: window.scrollX,
          scrollY: window.scrollY,
        });
      });
      // window.addEventListener("input",(e: InputEvent)=>{
      //   window.logEvent("input", {
      //     inputValue: (e.target as HTMLInputElement).value
      //   })
      // })
    }
    // Add event listeners in the browser document context for only "Profile_1" to control all.
    if (profileName === "Profile_1") {
      await page.evaluateOnNewDocument(captureBehaviorEvent);
    }
    //**Note */
    // if you make capture event on a website, you have to load listener before connect to website.
    // const currentPage = (await browser.pages())[0];

    const gotoLink = "https://www.google.com/";
    const gotoLink2 = "https://www.youtube.com/";
    await page.goto(gotoLink2, { waitUntil: "domcontentloaded"});

    return { browser, page };
  } catch (error) {
    console.error("Error connecting Puppeteer:", error);
  }
}

//**Change browser window size */
async function setWindowBounds(page: Page, width: number, height: number) {
  await page.setViewport({ width, height });
  const client = await page.createCDPSession();
  const { windowId } = await client.send("Browser.getWindowForTarget");
  await client.send("Browser.setWindowBounds", {
    windowId,
    bounds: { width, height },
  });
}

export {
  // Function
  Puppeteer_Connect_Profile,
  setWindowBounds,
  // emitter,

  // Type
  Profile_Puppeteer_Type,
  Response_Type_By_Puppeteer,
  CaptureEvent_Type,
};
