import {isLog} from "../common/consts";

export class Logger {
    static log(...args: any[]) {
        if (isLog) {
            console.log(args);
        }
    }

    static info(...args: any[]) {
        if (isLog) {
            console.info(args);
        }
    }

    static warn(...args: any[]) {
        if (isLog) {
            console.warn(args);
        }
    }

    static error(...args: any[]) {
        if (isLog) {
            console.error(args);
        }
    }
}
