import Message from "../classes/Message";
import ApiInteractor from "../classes/ApiInteractor";
import VKLocation from "../classes/VKLocation";
import {Logger} from "../classes/Logger";

export function kickEvent(ev: any, isAction = false) {
    let peerId, memberId
    if (isAction) {
        peerId = VKLocation.getConversation()
        Logger.log({node: ev.target.parentNode})
        memberId = ev.target.parentNode.parentNode.attributes.getNamedItem("data-from").value
    } else {
        peerId = Message.getPeerIdClick(ev) - 2000000000
        memberId = Message.getIdAuthorClick(ev)
    }
    const rawData = {
        chat_id: peerId,
        member_id: memberId
    }
    Logger.log(rawData);
    ApiInteractor.callApi({
        method: "messages.removeChatUser",
        data: rawData
    })
}
