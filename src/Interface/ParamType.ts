interface ParamForCommands {
    port: number;
    profileName: string;
    profilePath: string;
    width: number;
    height: number;
    posX: number;
    posY: number;
    openUrl: string;
}
interface SizeType {
    width: number;
    height: number;
  }

export type {
    ParamForCommands,
    SizeType,
}