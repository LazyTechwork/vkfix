export default function () {
    console.log("Hover kick");
    for(const message of document.getElementsByClassName('im-mess--actions')) {
        message.appendChild(addButton('И', 'Исключить', 'кик'));
        message.appendChild(addButton('+', 'Плюсануть', '+'));
        message.appendChild(addButton('С', 'Статистика', 'стата'));
    }
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
 return  ev
        .target
        .offsetParent
        .offsetParent
        .attributes
        .getNamedItem('data-peer').value;
}

function getPeerIdMessageClick(ev: any) {
    return  ev
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
