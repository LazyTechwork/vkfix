import MessageButton from "../classes/MessageButton";
import {kickEvent} from "./events";

const buttons: MessageButton[] = [{
    icon: 'K',
    action: ev => kickEvent(ev),
    tooltip: 'Исключить'
}];

export default function (actionGroup: any) {
    MessageButton.addButtons(buttons, actionGroup, 'message_actions')
}