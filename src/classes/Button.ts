import Message from "./Message";

export default class Button {
    public icon: string;
    public text: string;
    public command: string;

    static createButton(button: Button, node: any) {
        if(node.renderVkFixButtons) return; //если уже рендерили - не рендерим

        node.renderVkFixButtons = true; //ставим флаг на рендер
        const child = document.createElement('span');
        child.innerHTML = button.icon;
        child.className = 'vkfix-action';
        child.setAttribute('role', 'link');
        child.setAttribute('aria-label', button.text);
        child.addEventListener('click', (ev: any) => {
            // const id = Message.getIdAuthorClick(ev);
            const n  = Message.getParentClick(ev);
            const peerId = Message.getPeerIdClick(ev);
            const message = new Message();
            message.text = `Амадеус ${button.command}`;
            message.peerId = peerId;
            message.replyNode = n.getElementsByClassName('im-mess--reply')[0] as HTMLElement;
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
        node.appendChild(child);
    }

    static addButtons(buttons: Button[], node: Element) {
        for(const button of buttons) {
            Button.createButton(button, node);
        }
    }
}
