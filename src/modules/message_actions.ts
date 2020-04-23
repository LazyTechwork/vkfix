import MessageButton from "../classes/MessageButton";

const buttons: MessageButton[] = [{
    icon: 'K',
    action: () => alert('Test'),
    tooltip: 'Исключить'
}];

export default function (actionGroup: any) {
    MessageButton.addButtons(buttons, actionGroup, 'message_actions')
}