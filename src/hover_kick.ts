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
                    if (n.classList.contains('im-mess--actions'))
                        addButtons(n)
                }
        });
    });
    observer.observe(document.body, {childList: true, subtree: true});
}

function addButtons(node: Node) {
    node.appendChild(addButton(' И ', 'Исключить', 'кик'));
    node.appendChild(addButton(' + ', 'Плюсануть', '+'));
    node.appendChild(addButton(' С ', 'Статистика', 'стата'));
}

function addButton(icon: string, text: string, command: string) {
    const child = document.createElement('span');
    child.innerHTML = icon;
    child.className = 'im-mess--kicked _im_mess_kicked';
    child.setAttribute('role', 'link');
    child.setAttribute('aria-label', text);
    child.addEventListener('click', (ev: any) => {
        const id = getIdAuthorMessageClick(ev);
        const peerId = getPeerIdMessageClick(ev);
        sendMessageCurrentDialog(`Амадеус ${command} @id${id}`, peerId);
    });
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
    console.log({messageBlock});
    console.log(peerId, text);
    messageBlock.setValue(text);
    // messageBlock.innerText = text;
    const sendButtonEl: HTMLElement = messageBlock.parentNode.getElementsByClassName('im-send-btn')[0];
    // sendButtonEl.click();
}
