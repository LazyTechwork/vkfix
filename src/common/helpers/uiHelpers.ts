export function createVkUiButton(innerHTML: string, click: (e: MouseEvent) => any): HTMLDivElement {
    const ProfileHeaderButton = document.createElement("div");
    ProfileHeaderButton.className = "ProfileHeaderButton";
    const spanIn = document.createElement('span');
    spanIn.className = "vkuiButton__in";
    const spanCaption = document.createElement("span");
    spanCaption.className = "vkuiButton__content vkuiSubhead vkuiSubhead--sizeY-compact vkuiSubhead--w-2";
    spanCaption.innerHTML = innerHTML;
    const btn = document.createElement('a');
    btn.className = "vkuiButton vkuiButton--sz-m vkuiButton--lvl-secondary vkuiButton--clr-accent vkuiButton--aln-center vkuiButton--sizeY-compact vkuiTappable vkuiTappable--sizeX-regular vkuiTappable--hasHover vkuiTappable--hasActive vkuiTappable--mouse";
    spanIn.appendChild(spanCaption);
    btn.appendChild(spanIn);
    ProfileHeaderButton.appendChild(btn);
    ProfileHeaderButton.addEventListener('click', click);
    return ProfileHeaderButton;
}
