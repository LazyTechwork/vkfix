import MessageButton from '../classes/MessageButton';
import {kickEvent} from './events';
import GlobalConfig from '../GlobalConfig';

const isModuleEnabled = GlobalConfig.Config.get('conversationKick');

const buttons: MessageButton[] = [];
if (isModuleEnabled) {
  buttons.push({
    icon: 'K',
    action: ev => kickEvent(ev),
    tooltip: 'Исключить'
  });
}

export default function (actionGroup: any) {
  MessageButton.addButtons(buttons, actionGroup, 'message_actions');
}
