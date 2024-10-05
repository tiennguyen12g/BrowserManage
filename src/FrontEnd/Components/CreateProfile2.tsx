// Css
import classNames from "classnames/bind";
import styles from "./CreateProfile.module.scss";
const cx = classNames.bind(styles);
// Hooks
import { useEffect, useState } from "react";

// Libraries

// Components
import { CreateParamForCommand } from "./ListFunction";
import { ParamForCommands, SizeType } from "./ListFunction";
// import {ReturnKeyboardDetect} from "../Addon/KeyboardDetect/KeyboardDetect";
// Utils
import DefaultButton from "../Utils/DefaultButton";

//Type

interface ResultStatusType {
  success: boolean;
  message: {
    message: string;
    profileName: string;
  };
}

export default function CreateProfile2() {
  const arrayProfileName = [
    "Profile_1",
    "Profile_2",
    // "Profile_3",
    // "Profile_4",
    // "Profile_5",
    // "Profile_6",
    // "Profile_7",
    // "Profile_8",
    // "Profile_9",
    // "Profile_10",
    // "Profile_11",
    // "Profile_12",
    // "Profile_13",
    // "Profile_14",
    // "Profile_15",
    // "Profile_16",
  ];

  const [screenSize, setScreenSize] = useState<SizeType>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    async function fetchScreenSize() {
      const size = await window.electronAPI.getScreenSize();
      setScreenSize(size);
      console.log("size", size);
    }

    fetchScreenSize();
  }, []);
  const [defaultProfilePath, setDefaultProfilePath] = useState<string>("C:\\Users\\tienn\\OneDrive\\Desktop\\ChromeProfile_2");
  // Currently, google chrome set min-width is 500px
  const [defaultWindowSize, setDefaultWindowSize] = useState<SizeType>({width:600,height: 800,});
  const [defaultUrl, setDefaultUrl] = useState<string>("https://www.google.com");

  // Build param for profile
  const arrayParam = CreateParamForCommand({
    screenSize: screenSize,
    profileSize: {
      width: defaultWindowSize.width,
      height: defaultWindowSize.height,
    },
    defaultProfilePath: defaultProfilePath,
    arrayProfileName: arrayProfileName,
    width: defaultWindowSize.width,
    height: defaultWindowSize.height,
    openUrl: "https://www.youtube.com/watch?v=278OdcGMBcc",
  });

  const [maxProfileCanShow, setMaxProfileCanShow] = useState<number>(
    arrayParam.length
  );
  useEffect(() => {
    console.log("arrayParam", arrayParam);
    setMaxProfileCanShow(arrayParam.length);
  }, [arrayParam]);

  //** Puppeteer  */
  const [pupProfileRunning, setPupProfileRunning] = useState<{
    [key: string]: string;
  }>({});
  const [arrayProfileRunning, setArrayProfileRunning] = useState<string[]>([])
  // Handle open/ close each profile
  const open_One_Profile = async (profileName: string, index: number) => {
    try {
      const param = arrayParam[index];
      await window.electronAPI.call_open_profile_by_command(param);
    } catch (error) {
      console.log("open_One_Profile function error:", error);
    }
  };
  const close_One_Profile = async (profileName: string) => {
    try {
     await window.electronAPI.call_puppeteer_close_profile(profileName);
    } catch (error) {
      console.log("close_One_Profile function error:", error);
    }
  };

  //Handle open/ close all profile

  const open_All_Profile = async () =>{
    try {
      for (const param of arrayParam) {
        await window.electronAPI.call_open_profile_by_command(param);
      }
    } catch (error) {
      console.log("open_All_Profile function error:", error);
    }
  }

  const close_All_Profile = async () => {
    try {
      // const arrayProfileOpening = Object.keys(pupProfileRunning);
      for (const profileName of arrayProfileRunning) {
        await window.electronAPI.call_puppeteer_close_profile(profileName);
      }
    } catch (error) {
      console.log("close_All_Profile function error:", error);
    }
  }

  // receive message when profile open success
  useEffect(() => {
    window.electronAPI.response_open_profile_by_command(
      (event: any, { success, message }: ResultStatusType) => {
        if (success) {
          const profileNameSuccess = message.profileName;
          console.log('222');
          setArrayProfileRunning((prev) => [...prev, profileNameSuccess]);
          console.log("Profile created successfully:", message.message);
        } else {
          console.log("Failed to create profile:", message.message);
        }
      }
    );
  }, []);
  // useEffect(()=>{
  //   console.log('arrayProfileRunning', arrayProfileRunning);
  // },[arrayProfileRunning])
  // receive message when profile was closed
  useEffect(() => {
    window.electronAPI.response_puppeteer_close_profile(
      (event: any, { success, message }: ResultStatusType) => {
        if (success) {
          const profileName = message.profileName;
          setArrayProfileRunning((prev) => prev.filter((name) => name !== profileName));
          console.log(`Profile ${profileName} was closed.`);
        } else {
          console.log("Failed to close profile:", message.message);
        }
      }
    );
  }, []);
  //**Listening event */
  // useEffect(() =>{
  //   window.controlAPI.onScrollEvent((event, scrollPosition) => {
  //     console.log('Scroll event received:', scrollPosition);
  //   });

  //   window.controlAPI.onKeyEvent((event, keyEvent) => {
  //     console.log('Key event received:', keyEvent);
  //   });
  // },[])

  const [newSize, setNewSize] = useState<SizeType>(defaultWindowSize);
  const handleChangeSize = (type: string, e: any) => {
    console.log('newSize', newSize);
    if(type === "width"){
      setNewSize({...newSize, width: +e.target.value});
    }
    if(type === "height"){
      setNewSize({...newSize, height: +e.target.value});
    }
  }
  const [prevSize, setPrevSize] = useState(defaultWindowSize)
  const handleApplyNewSize = async () => {
    try {
      if(newSize.width !== prevSize.width || newSize.height !== prevSize.height){
        await window.electronAPI.call_apply_new_window_size(newSize);
        setPrevSize(newSize);
      } else{
        console.log('the size does not change');
      }

    } catch (error) {
      console.log('handleApplyNewSize error:', error);
    }
  }
  const [enter, setEnter] = useState(false)
  //Message from apply window size
  useEffect(()=>{
    window.electronAPI.response_apply_window_size((event: any, {success, message}: ResultStatusType) => {
      if (success) {
        const profileName = message.profileName;
        console.log(`Profile ${profileName} was changed size.`);
      } else {
        console.log("Failed to change size profile:", message.message);
      }
    });

    window.electronAPI.handleEnter(()=>{
      console.log('run');
    });
    // ReturnKeyboardDetect();

  },[])
  // Value gird for table
  const gridValue = "40px 120px 150px 200px 80px 60px";
  return (
    <div>
      Create Chrome Profile
      <div>
        You can only show {maxProfileCanShow} profiles by your desktop screen is
        not enough space.
      </div>
      {enter ? <div>Eneter</div> : <div>None</div>}
      <div className={cx("setting")}>
        <div className={cx("window-size")}>
          <div>Config for chrome window</div>
          <div>
            Current setting: {newSize.width}x
            {newSize.height} (width x height)
          </div>
          <div>
            <span>Width: </span>
            <input type="number" onChange={(e: any) => handleChangeSize('width', e)}/>
            <span>height: </span>
            <input type="number" onChange={(e: any) => handleChangeSize('height', e)}/>

            <button onClick={handleApplyNewSize}>Apply new size</button>
          </div>
          <div>

          </div>
        </div>
      </div>
      <h4>Selenium</h4>
      <div></div>
      {/* <div className={cx('table-listing-profile')}>
        <div className={cx('header-title')} style={{gridTemplateColumns:gridValue}}>
          <div>No</div>
          <div>Profile Name</div>
          <div>Proxy</div>
          <div>Note</div>
          <div>Status</div>
          <div>Action</div>
        </div>
        <div className={cx('table-body')}>
          {arrayParam.map((profileParam: ParamForCommands, i: number) => {
            const profileName = profileParam.profileName;
            const isOpen = arrayOpenSuccess[i] === profileName ? true : false;
            return(
              <div className={cx('table-row')} style={{gridTemplateColumns:gridValue}} key={i}>
                <div>{i + 1}</div>
                <div>{profileName}</div>
                <div>None</div>
                <div>No comment</div>
                <div>{arrayOpenSuccess[profileName] === "open" ? <span style={{color:"green"}}>Opening</span> : <span style={{color:"red"}}>Offline</span>}</div>
                <div>
                  { arrayOpenSuccess[profileName] === "open" ? 
                  <DefaultButton 
                    button_name="Close"
                    onClick={() => handle_Close_One_By_Selenium(profileName)}
                  />:
                  <DefaultButton 
                    button_name="Open"
                    onClick={()=> handle_Open_One_By_Selenium(profileName)}
                  />
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div> */}
      <div>
        {/* <div>PupProfile: <span style={{color: pupProfileRunning ? "green": "gainsboro"}}>{pupProfileRunning ? "opening" : "offline"}</span></div>
        <DefaultButton button_name='puppeteer open one' onClick={() => handle_Open_One_By_Pup("Profile_1")}/> */}
      </div>
      <h4>Puppeteer</h4>
      <div className={cx("table-listing-profile")}>
        <div
          className={cx("header-title")}
          style={{ gridTemplateColumns: gridValue }}
        >
          <div>No</div>
          <div>Profile Name</div>
          <div>Proxy</div>
          <div>Note</div>
          <div>Status</div>
          <div>Action</div>
        </div>
        <div className={cx("table-body")}>
          {arrayParam.map((profileParam: ParamForCommands, i: number) => {
            const profileName = profileParam.profileName;
            const isExistProfile = arrayProfileRunning.indexOf(profileName);
            return (
              <div
                className={cx("table-row")}
                style={{ gridTemplateColumns: gridValue }}
                key={i}
              >
                <div>{i + 1}</div>
                <div>{profileName}</div>
                <div>None</div>
                <div>No comment</div>
                <div>
                  {isExistProfile > -1 ? (
                    <span style={{ color: "green" }}>Opening</span>
                  ) : (
                    <span style={{ color: "red" }}>Offline</span>
                  )}
                </div>
                <div>
                  {isExistProfile > -1 ? (
                    <DefaultButton
                      button_name="Close"
                      onClick={() => close_One_Profile(profileName)}
                    />
                  ) : (
                    <DefaultButton
                      button_name="Open"
                      onClick={() => open_One_Profile(profileName, i)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* <div>
        <button disabled={Object.keys(pupProfileRunning).length === arrayParam.length ? true : false} onClick={open_All_Profile}>Open all</button>
        
        <button disabled={Object.keys(pupProfileRunning).length === 0 ? true : false} onClick={close_All_Profile}>Close all</button>
      </div> */}
      <div>
        <button disabled={arrayProfileRunning.length === arrayParam.length ? true : false} onClick={open_All_Profile}>Open all</button>
        
        <button disabled={arrayProfileRunning.length === 0 ? true : false} onClick={close_All_Profile}>Close all</button>
      </div>
      <div></div>
    </div>
  );
}
