interface SizeType {
  width: number;
  height: number;
}
interface PositionOnScreen_Props {
  screenSize: SizeType;
  profileSize: SizeType;
  totalProfile: number;
}
interface PositionType {
  posX: number;
  posY: number;
}
interface CreateChromeProfile_Props {
  chromeExecuteFilePath?: string;
  profileName: string;
  profilePath: string;
  width: number;
  height: number;
  posX: number;
  posY: number;
  openUrl: string;
}

interface ParamForCommands {
  profileName: string;
  profilePath: string;
  width: number;
  height: number;
  posX: number;
  posY: number;
  openUrl: string;
}
interface CreateParamForCommand_Props {
  screenSize: SizeType;
  profileSize: SizeType;
  profilePath: string;
  arrayProfileName: string[];
  width: number;
  height: number;
  openUrl: string;
}
export { 
     SizeType,
     PositionType,
     PositionOnScreen_Props,

     CreateChromeProfile_Props,
     ParamForCommands,
     CreateParamForCommand_Props,
 };
