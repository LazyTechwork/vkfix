import amadeus_actions from "../amadeus_actions";
import message_actions from "../message_actions";
import VKLocation from "../../classes/VKLocation";
import leavekick from "../leavekick";

export default function (mutation: MutationRecord) {
    if (mutation.target.nodeType !== 1) return; // Если мутация текст - переходим дальше
    if (!VKLocation.isConversation()) return;

    let target: HTMLElement = mutation.target as HTMLElement // Получаем цель мутации
    let classes: DOMTokenList = target.classList // Получаем список классов

    if (!classes) return; // Если их нет - переходим дальше
    if (classes.contains('im-mess')) { // Если цель мутации - сообщение
        let isActMsg = classes.contains("im-mess_srv")
        console.log(isActMsg)
        for (let n of target.children) { // Получаем всех детей элемента
            if (!n.classList) continue // Если у ребенка нет классов переходим дальше

            if (isActMsg && n.classList.contains("im-mess--text"))
                action_mutation_act(n)

            if (n.classList.contains('im-mess--actions'))  // Если это группа действий и в ней нет наших кнопок - добавляем их
                mutation_act(n)
        }
    }
}

export function mutation_act(n: any) {
    amadeus_actions(n)
    message_actions(n)
}

export function action_mutation_act(n: any) {
    leavekick(n)
}