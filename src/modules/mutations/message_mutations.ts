import amadeus_actions from "../amadeus_actions";
import message_actions from "../message_actions";

export default function (mutation: MutationRecord) {
    if (mutation.target.nodeType !== 1) return; // Если мутация текст - переходим дальше

    let target: HTMLElement = mutation.target as HTMLElement // Получаем цель мутации
    let classes: DOMTokenList = target.classList // Получаем список классов

    if (!classes) return; // Если их нет - переходим дальше
    if (classes.contains('im-mess')) // Если цель мутации - сообщение
        for (let n of target.children) { // Получаем всех детей элемента
            if (!n.classList) continue // Если у ребенка нет классов переходим дальше
            if (n.classList.contains('im-mess--actions')) { // Если это группа действий и в ней нет наших кнопок - добавляем их
                mutation_act(n)
            }
        }
}

export function mutation_act(n: any) {
    amadeus_actions(n)
    message_actions(n)
}