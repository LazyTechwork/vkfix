import AmadeusConfig from "./classes/AmadeusConfig";
import AmadeusButton from "./classes/AmadeusButton";

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

export default function () {
    console.log("Подключён модуль управления конференцией при помощи Амадеуса");

    // При инциализации скрипта пробегаемся по всем сообщениям и добавляем кнопки
    for (const n of document.getElementsByClassName('im-mess--actions'))
        AmadeusButton.addButtons(AmadeusConfig.Global, n);

    // Настраиваем слежение мутаций в DOM
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.target.nodeType !== 1) return; // Если мутация текст - переходим дальше

            let target: HTMLElement = mutation.target as HTMLElement // Получаем цель мутации
            let classes: DOMTokenList = target.classList // Получаем список классов

            if (!classes) return; // Если их нет - переходим дальше
            if (classes.contains('im-mess')) // Если цель мутации - сообщение
                for (let n of target.children) { // Получаем всех детей элемента
                    if (!n.classList) continue // Если у ребенка нет классов переходим дальше
                    if (n.classList.contains('im-mess--actions'))
                        AmadeusButton.addButtons(AmadeusConfig.Global, n); // Если это группа действий и в ней нет наших кнопок - добавляем их
                }
        });
    });
    observer.observe(document.body, {childList: true, subtree: true}); // Включаем нашего следящего на body
}
