import Message from "./Message";
import AmadeusConfig from "./AmadeusConfig";
import MessageButton from "./MessageButton";

export default class AmadeusButton {
    public icon: string;
    public text: string;
    public command: string;

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
