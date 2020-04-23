import Button from "./Button";

export default class Config {
    static Global: Config;
    buttons: Button[];
    prevCommandText = '';
    replyMessage = false;
}
