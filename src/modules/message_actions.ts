import MessageButton from "../classes/MessageButton";
import Message from "../classes/Message";
import ApiInteractor from "../classes/ApiInteractor";

const buttons: MessageButton[] = [{
    icon: 'K',
    action: (ev: any) => {
        const endpoint = 'https://' + location.host + '/al_im.php';
        const peerId = Message.getPeerIdClick(ev);
        const memberId = Message.getIdAuthorClick(ev);
        const rawData = {
            act: 'a_kick_user',
            al: 1,
            chat: peerId,
            gid: 0,
            im_v: 3,
            mid: memberId
        };
        console.log(rawData);
        ApiInteractor.callApiRaw(rawData, endpoint).then(r => {
            console.log(r)
        });
        /*
            https://vk.com/al_im.php
            act: a_kick_user
            al: 1
            chat: 2000000270
            gid: 0
            im_v: 3
            mid: 171882202
         */

    },
    tooltip: 'Исключить'
}];

export default function (actionGroup: any) {
    MessageButton.addButtons(buttons, actionGroup, 'message_actions')
}