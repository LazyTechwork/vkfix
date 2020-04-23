import Config from "./classes/Config";
import Button from "./classes/Button";

Config.Global = {
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
    console.log("Hover kick");

    // При инциализации скрипта пробегаемся по всем сообщениям и добавляем кнопки
    for (const n of document.getElementsByClassName('im-mess--actions'))
        Button.addButtons(Config.Global, n);

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
                    if (n.classList.contains('im-mess--actions') && n.getElementsByClassName('vkfix-action').length == 0)
                        Button.addButtons(Config.Global, n); // Если это группа действий и в ней нет наших кнопок - добавляем их
                }
        });
    });
    observer.observe(document.body, {childList: true, subtree: true}); // Включаем нашего следящего на body
}
