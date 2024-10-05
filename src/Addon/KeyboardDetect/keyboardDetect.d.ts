// declare module "keyboardDetect" {
//     function listenForKeyPress(callback: (message: string) => void): void;
//     export { listenForKeyPress };
//   }
declare module "./Addon/KeyboardDetect/KeyboardDetect" {
    function listenForKeyPress(callback: (message: string) => void): void;
    export { listenForKeyPress };
  }
  