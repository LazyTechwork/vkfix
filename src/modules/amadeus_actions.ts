import AmadeusConfig from "../classes/AmadeusConfig";
import AmadeusButton from "../classes/AmadeusButton";
import GlobalConfig from "../GlobalConfig";

AmadeusConfig.Global = {
    prevCommandText: 'Амадеус ',
    replyMessage: true,
    buttons: [{
        icon: 'И',
        text: "Исключить",
        command: 'кик'
    }, {
        icon: '+',
        text: "Плюсануть",
        command: '+'
    }, {
        icon: 'С',
        text: "Статистика",
        command: 'стата'
    }]
};

const isModuleEnabled = GlobalConfig.Config.get('amadeus');

export default function (n: any) {
    if (isModuleEnabled)
        AmadeusButton.addButtons(AmadeusConfig.Global, n);
}
