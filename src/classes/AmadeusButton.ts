import Message from "./Message";
import AmadeusConfig from "./AmadeusConfig";
import MessageButton from "./MessageButton";

export default class AmadeusButton {
    public icon: string;
    public text: string;
    public command: string;

    /*static createButton(button: AmadeusButton, node: any, config: AmadeusConfig) {
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
            if (config.replyMessage) {
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
    }*/

    static addButtons(config: AmadeusConfig, actionGroup: any) {
        let buttons: MessageButton[] = [];

        for (const button of config.buttons) buttons.push({
            tooltip: button.text,
            icon: button.icon,
            action: (ev) => {
                const n = Message.getParentClick(ev);
                const peerId = Message.getPeerIdClick(ev);
                const message = new Message();
                message.text = `${config.prevCommandText}${button.command}`;
                message.peerId = peerId;
                if (config.replyMessage)
                    message.replyNode = n.getElementsByClassName('im-mess--reply')[0] as HTMLElement
                message.sendCurrentDialog();
            }
        })

        MessageButton.addButtons(buttons, actionGroup, 'amadeus_actions');
    }
}
