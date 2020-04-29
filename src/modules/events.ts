import Message from "../classes/Message";
import ApiInteractor from "../classes/ApiInteractor";

export function kickEvent(ev: any) {
    const peerId = Message.getPeerIdClick(ev)
    const memberId = Message.getIdAuthorClick(ev)
    const rawData = {
        chat_id: (peerId - 2000000000),
        member_id: memberId
    }
    console.log(rawData);
    ApiInteractor.callApi('messages.removeChatUser', rawData)
}