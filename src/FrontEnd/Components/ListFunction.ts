import { ParamForCommands } from "src/Interface/ParamType";
interface CreateParamForCommand_Props {
  screenSize: SizeType;
  profileSize: SizeType;
  defaultProfilePath: string,
  arrayProfileName: string[];
  width: number;
  height: number;
  openUrl: string;
}
const CreateParamForCommand = ({
  arrayProfileName,
  screenSize,
  profileSize,
  width,
  height,
  openUrl,
  defaultProfilePath,
}: CreateParamForCommand_Props): ParamForCommands[] => {
  const totalProfile = arrayProfileName.length;
  const arrayPosition = PositionOnScreen({
    totalProfile: totalProfile,
    screenSize: screenSize,
    profileSize: profileSize,
  });

  const arrayParam: ParamForCommands[] = arrayPosition.map(
    (position: PositionType, i: number) => {
      const profileName = arrayProfileName[i];
      const profilePath = `${defaultProfilePath}\\${profileName}`;
      // console.log('profilePath',profilePath);
      const objParam: ParamForCommands = {
        port:19000 + i,
        profileName: profileName,
        profilePath: profilePath,
        width: width,
        height: height,
        posX: arrayPosition[i].posX,
        posY: arrayPosition[i].posY,
        openUrl: openUrl,
      };
      return objParam;
    }
  );
  // console.log('arrayParam',arrayParam);
  return arrayParam;
};

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
function PositionOnScreen({
  screenSize,
  profileSize,
  totalProfile,
}: PositionOnScreen_Props): PositionType[] {
  const gapWidth = 3;
  const gapHeight = 3;
  const screenHeight = screenSize.height;
  const screenWidth = screenSize.width;
  const profileHeight = profileSize.height;
  const profileWidth = profileSize.width;

  // calculate how many profile in row and column
  const maxProfile_In_Row = Math.floor(screenWidth / (profileWidth + gapWidth));
  const maxProfile_In_Column = Math.floor(
    screenHeight / (profileHeight + gapHeight)
  );
  const maxProfile_Can_Show = maxProfile_In_Column * maxProfile_In_Row;

  // calculate how many row and column
  const totalRow_Needed = totalProfile / maxProfile_In_Row;
  const totalColumn_Needed = totalProfile / maxProfile_In_Column;

  // According maxProfile_In_Row value, build array number of profile for each row. Ex: [[1,2,3],[4,5]]
  const arrayArrange: number[][] = Array.from({
    length: maxProfile_In_Column,
  }).map((_, i: number) => {
    const arrayInRow = Array.from({ length: maxProfile_In_Row })
      .map((_, k: number) => {
        return i * maxProfile_In_Row + k;
      })
      .filter((index) => index < totalProfile); // Ensure not to exceed totalProfile
    return arrayInRow;
  });

  const arrayPosition: PositionType[][] = arrayArrange.map(
    (arrayInRow: number[], i: number) => {
      const getGapHeight = i === 0 ? 0 : gapHeight;
      const arrayPositionInRow = arrayInRow.map((_, k: number) => {
        const getGapWidth = k === 0 ? 0 : gapWidth;
        const posX = k * profileWidth + getGapWidth * k;
        const posY = i * profileHeight + getGapHeight * i;
        return { posX, posY };
      });
      return arrayPositionInRow;
    }
  );
  // console.log("arrayPosition.flat()", arrayPosition.flat());
  return arrayPosition.flat();
}

export { CreateParamForCommand };
export type { ParamForCommands, SizeType };
