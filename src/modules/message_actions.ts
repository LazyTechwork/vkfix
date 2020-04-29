import MessageButton from "../classes/MessageButton";
import Message from "../classes/Message";
import ApiInteractor from "../classes/ApiInteractor";

const buttons: MessageButton[] = [{
    icon: 'K',
    action: (ev: any) => {
        const peerId = Message.getPeerIdClick(ev)
        const memberId = Message.getIdAuthorClick(ev)
        const rawData = {
            chat_id: (peerId - 2000000000),
            member_id: memberId
        }
        console.log(rawData)
        ApiInteractor.callApi('messages.removeChatUser', rawData)
    },
    tooltip: 'Исключить'
}];

export default function (actionGroup: any) {
    MessageButton.addButtons(buttons, actionGroup, 'message_actions')
}