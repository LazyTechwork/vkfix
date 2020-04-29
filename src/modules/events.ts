import Message from "../classes/Message";
import ApiInteractor from "../classes/ApiInteractor";
import VKLocation from "../classes/VKLocation";

export function kickEvent(ev: any, isAction = false) {
    let peerId, memberId
    if (isAction) {
        peerId = VKLocation.getConversation()
        memberId = ev.targe.parentNode.attributes.getNamedItem("data-from").value
    } else {
        peerId = Message.getPeerIdClick(ev) - 2000000000
        memberId = Message.getIdAuthorClick(ev)
    }
    const rawData = {
        chat_id: peerId,
        member_id: memberId
    }
    console.log(rawData);
    ApiInteractor.callApi('messages.removeChatUser', rawData)
}