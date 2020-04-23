import AmadeusButton from "./AmadeusButton";

export default class AmadeusConfig {
    static Global: AmadeusConfig;
    buttons: AmadeusButton[];
    prevCommandText = '';
    replyMessage = false;
}
