import AmadeusConfig from "../classes/AmadeusConfig";
import AmadeusButton from "../classes/AmadeusButton";
import GlobalConfig, {defaultBotButtons} from "../GlobalConfig";
let aliasBot = GlobalConfig.Config.get('botName') ?? '';
let botAction: any = [];
try {
    botAction = JSON.parse(GlobalConfig.Config.get('botAction')) ?? [];
}catch {
    botAction = defaultBotButtons;
}
if(aliasBot.length > 0) aliasBot = `${aliasBot} `;

AmadeusConfig.Global = {
    prevCommandText: aliasBot,
    replyMessage: true,
    buttons: botAction
};

console.log(botAction);

const isModuleEnabled = GlobalConfig.Config.get('amadeus');

export default function (n: any) {
    if (isModuleEnabled)
        AmadeusButton.addButtons(AmadeusConfig.Global, n);
}
