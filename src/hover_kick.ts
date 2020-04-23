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
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.target.nodeType !== 1) return;
            let target: HTMLElement = mutation.target as HTMLElement
            let classes: DOMTokenList = target.classList
            if (!classes) return;
            // console.log("Произошла мутация (im-mess--actions)!", mutation, classes)

            if (classes.contains('im-mess'))
                for (let n of target.children) {
                    if (!n.classList) return
                    if (n.classList.contains('im-mess--actions') && n.getElementsByClassName('vkfix-action').length == 0)
                        Button.addButtons(Config.Global, n);
                }
        });
    });
    observer.observe(document.body, {childList: true, subtree: true});
}
