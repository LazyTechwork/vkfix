import {kickEvent} from "./events";

export default function (n: any) {
    const groupId = "leavekick"
    if (n.vkfix && n.vkfix[groupId]) return
    const link = document.createElement('a')
    link.href = "#kick"
    link.innerHTML = "Исключить"
    link.className = "im_srv_lnk"
    link.addEventListener("click", ev=> kickEvent(ev, true))
    n.appendChild(document.createTextNode(". "))
    n.appendChild(link)
    if (!n.vkfix)
        n.vkfix = {}
    n.vkfix[groupId] = true
}