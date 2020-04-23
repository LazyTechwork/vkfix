import MessageButton from "../classes/MessageButton";

const buttons: MessageButton[] = [{
    icon: 'K',
    action: (ev: any) => {
    /*    https://vk.com/al_im.php
          act: a_kick_user
al: 1
chat: 2000000270
gid: 0
hash: 1587667820_e7126e9df341ed5f59
im_v: 3
mid: 171882202
     */
    },
    tooltip: 'Исключить'
}];

export default function (actionGroup: any) {
    MessageButton.addButtons(buttons, actionGroup, 'message_actions')
}