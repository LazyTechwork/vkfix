import Message from "./Message";
import Config from "./Config";

export default class Button {
    public icon: string;
    public text: string;
    public command: string;

    static createButton(button: Button, node: any, config: Config) {
        const child = document.createElement('span');
        child.innerHTML = button.icon;
        child.className = 'vkfix-action';
        child.setAttribute('role', 'link');
        child.setAttribute('aria-label', button.text);
        child.addEventListener('click', (ev: any) => {
            // const id = Message.getIdAuthorClick(ev);
            const n = Message.getParentClick(ev);
            const peerId = Message.getPeerIdClick(ev);
            const message = new Message();
            message.text = `${config.prevCommandText}${button.command}`;
            message.peerId = peerId;
            if(config.replyMessage) {
                message.replyNode = n.getElementsByClassName('im-mess--reply')[0] as HTMLElement;
            }

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

    static addButtons(config: Config, node: any) {
        if (node.renderVkFixButtons) return; // уже рендерили

        for (const button of config.buttons) {
            Button.createButton(button, node, config);
        }

        node.renderVkFixButtons = true; //ставим флаг на рендер
    }
}
