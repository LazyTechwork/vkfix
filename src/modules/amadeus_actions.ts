import AmadeusConfig from "../classes/AmadeusConfig";
import AmadeusButton from "../classes/AmadeusButton";

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

console.log("Подключён модуль управления конференцией при помощи Амадеуса");

export default function (n: any) {
    AmadeusButton.addButtons(AmadeusConfig.Global, n);
}
