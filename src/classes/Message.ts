export default class Message {
    text: string;
    peerId: number;
    replyNode: HTMLElement = null;

    sendCurrentDialog() {
        if (this.replyNode !== null) {
            this.replyNode.addEventListener('click', (ev) => {
              this._sendCurrentDialog();
            }, {once: true})
            this.replyNode.click()
        }
        else {
            this._sendCurrentDialog();
        }
    }

    private _sendCurrentDialog() {
        const messageBlock: any = document.getElementsByClassName('im_editable')[0]
        messageBlock.setValue(this.text);
        const sendButtonEl: HTMLElement = messageBlock.parentNode.getElementsByClassName('im-send-btn')[0];
        sendButtonEl.click();
    }


    static getIdAuthorClick(ev: any) {
        return ev
            .target
            .offsetParent
            .offsetParent
            .attributes
            .getNamedItem('data-peer').value;
    }

    static getParentClick(ev: any) {
        return ev
            .target
            .offsetParent
            .offsetParent;
    }

    static getPeerIdClick(ev: any) {
        return ev
            .target
            .offsetParent
            .offsetParent
            .childNodes[3]
            .childNodes[3]
            .childNodes[1]
            .attributes
            .getNamedItem('data-peer').value;
    }
}
