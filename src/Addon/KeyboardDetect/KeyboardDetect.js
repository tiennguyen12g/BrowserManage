// import keyboardDetect from './build/Release/keyboardDetect.node';
// import { listenForKeyPress } from "./build/Release/keyboardDetect.node";

// import { listenForKeyPress } from "keyboardDetect";
// import {createRequire} from 'node:module';
// const require = createRequire(import.meta.url);
const keyboardDetect = require('./build/Release/keyboardDetect');
function ReturnKeyboardDetect (){
    const keyName = keyboardDetect.listenForKeyPress((message) => {
        console.log(message);
        return message;
    });
    console.log('keyname', keyName);
    return keyName;
}

// ReturnKeyboardDetect();
module.exports = {ReturnKeyboardDetect}