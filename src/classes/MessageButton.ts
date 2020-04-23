export default class MessageButton {
    public icon: string;
    public tooltip: string;
    public action: Function;

    static createButton(button: MessageButton, actionGroup: any) {
        const child = document.createElement('span');
        child.innerHTML = button.icon;
        child.className = 'vkfix-action';
        child.setAttribute('role', 'link');
        child.setAttribute('aria-label', button.tooltip);
        child.addEventListener('click', (ev: MouseEvent) => button.action(ev));
        child.onmouseover = function () {
            // @ts-ignore
            if (!showTooltip) return
            // @ts-ignore
            showTooltip(child, {
                force: 1,
                black: 1,
                content: '<div class="tt_text wrapped">' + button.tooltip + '</div>'
            });
        }
        actionGroup.appendChild(child);
    }

    static addButtons(buttons: MessageButton[], actionGroup: any) {
        if (actionGroup.renderVkFixButtons) return // уже рендерили

        for (const button of buttons)
            MessageButton.createButton(button, actionGroup)

        actionGroup.renderVkFixButtons = true // ставим флаг на рендер
    }
}
