import Message from "./Message";

export default class Button {
    public icon: string;
    public text: string;
    public command: string;

    static createButton(button: Button) {
        const child = document.createElement('span');
        child.innerHTML = button.icon;
        child.className = 'vkfix-action';
        child.setAttribute('role', 'link');
        child.setAttribute('aria-label', button.text);
        child.addEventListener('click', (ev: any) => {
            // const id = Message.getIdAuthorClick(ev);
            const node  = Message.getParentClick(ev);
            const peerId = Message.getPeerIdClick(ev);
            const message = new Message();
            message.text = `Амадеус ${button.command}`;
            message.peerId = peerId;
            message.replyNode = node.getElementsByClassName('im-mess--reply')[0] as HTMLElement;
            console.log({message});
            message.sendCurrentDialog();
        });
        child.onmouseover = function () {
            // @ts-ignore
            if (!showTooltip) return
            // @ts-ignore
            showTooltip(child, {
                force: 1,
                black: 1,
                content: '<div class="tt_text wrapped">' + button.text + '</div>'
            });
        }
        return child;
    }

    static addButtons(buttonsElements: HTMLSpanElement[], node: Element) {
        for(const buttonEl of buttonsElements) {
            console.log({buttonEl});
            node.appendChild(buttonEl);
        }
        console.log('addButtons',{node});

    }
}
