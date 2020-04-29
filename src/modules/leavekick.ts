import Message from "../classes/Message";
import ApiInteractor from "../classes/ApiInteractor";

export default function (n: any) {
    const link = document.createElement('a')
    link.href = "#kick"
    link.innerHTML = "Исключить"
    link.className = "im_srv_lnk"
    link.addEventListener("click", (ev: any) => {
        const peerId = Message.getPeerIdClick(ev)
        const memberId = Message.getIdAuthorClick(ev)
        const rawData = {
            chat_id: (peerId - 2000000000),
            member_id: memberId
        }
        console.log(rawData);
        ApiInteractor.callApi('messages.removeChatUser', rawData)
    })
    n.appendChild(document.createTextNode(". "))
    n.appendChild(link)
}