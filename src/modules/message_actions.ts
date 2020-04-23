import MessageButton from "../classes/MessageButton";

export default function (actionGroup: any) {
    const buttons: MessageButton[] = [{
        icon: 'K',
        action: () => alert('Test'),
        tooltip: 'Исключить'
    }];
    MessageButton.addButtons(buttons, actionGroup, 'message_actions')
}