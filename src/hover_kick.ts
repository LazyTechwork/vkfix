export default function () {
    console.log("Hover kick");
    const pw = document.querySelector('#content');
    let observer = new MutationObserver(function (mutations) {
        // im-mess--actions
        mutations.forEach(function (mutation) {
            console.log(mutation)
            let classes: DOMTokenList = mutation.target['classList']
            if (classes.contains('im-mess-stack') || classes.contains('_im_peer_history')) {
                // for (const message of document.getElementsByClassName('im-mess--actions'))
                //     addButtons(message)
            }

            for (const node of mutation.addedNodes) {
                if (!node || typeof node != 'object')
                    return
                let classes = node['classList']
                // console.log(node);
                if (classes.contains('im-mess--actions'))
                    addButtons(node)
                else if (classes.contains('im-mess'))
                    for (const child of node.childNodes) {
                        if (child['classList'].contains('im-mess--actions'))
                            addButtons(child)
                    }
                else if (classes.contains('im-mess-stack') || classes.contains('_im_peer_history')) {
                    for (const message of document.getElementsByClassName('im-mess--actions'))
                        addButtons(message)
                }
            }
        });
    });
    observer.observe(pw, {attributes: false, childList: true, characterData: false, subtree: true});
}

function addButtons(node: Node) {
    node.appendChild(addButton('И', 'Исключить', 'кик'));
    node.appendChild(addButton('+', 'Плюсануть', '+'));
    node.appendChild(addButton('С', 'Статистика', 'стата'));
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
    // console.log({messageBlock});
    messageBlock.innerText = text;
    const sendButtonEl = messageBlock.parentNode.getElementsByClassName('im-send-btn')[0];
    sendButtonEl.click();
    // console.log({sendButtonEl});
}
