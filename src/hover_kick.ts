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
                        addButtons(n)
                }
        });
    });
    observer.observe(document.body, {childList: true, subtree: true});
}

function addButtons(node: Node) {
    node.appendChild(addButton('И', 'Исключить', 'кик'));
    node.appendChild(addButton('+', 'Плюсануть', '+'));
    node.appendChild(addButton('С', 'Статистика', 'стата'));
}

function addButton(icon: string, text: string, command: string) {
    const child = document.createElement('span');
    child.innerHTML = icon;
    child.className = 'vkfix-action';
    child.setAttribute('role', 'link');
    child.setAttribute('aria-label', text);
    child.addEventListener('click', (ev: any) => {
        const id = getIdAuthorMessageClick(ev);
        const peerId = getPeerIdMessageClick(ev);
        sendMessageCurrentDialog(`Амадеус ${command} @id${id}`, peerId);
    });
    child.onmouseover = function () {
        // @ts-ignore
        if (!showTooltip) return
        // @ts-ignore
        showTooltip(child, {
            force: 1,
            black: 1,
            content: '<div class="tt_text wrapped">' + text + '</div>'
        });

    }
    return child;
}

function getIdAuthorMessageClick(ev: any) {
    return ev
        .target
        .offsetParent
        .offsetParent
        .attributes
        .getNamedItem('data-peer').value;
}

function getPeerIdMessageClick(ev: any) {
    return ev
        .target
        .offsetParent
        .offsetParent
        .childNodes[3]
        .childNodes[3]
        .childNodes[1]
        .attributes
        .getNamedItem('data-peer').value;
}

function sendMessageCurrentDialog(text: string, peerId: number) {
    const messageBlock: any = document.getElementById(`im_editable${peerId}`)
    messageBlock.setValue(text);
    const sendButtonEl: HTMLElement = messageBlock.parentNode.getElementsByClassName('im-send-btn')[0];
    sendButtonEl.click();
}
