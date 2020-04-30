import {action_mutation_act, mutation_act} from "./mutations/message_mutations";

export default function () {
    // При инциализации скрипта пробегаемся по всем сообщениям и добавляем кнопки
    console.log("Page Scanner")
    for (const msgNodes of document.getElementsByClassName('im-mess')) {
        let isActMsg = msgNodes.classList.contains("im-mess_srv")
        for (let n of msgNodes.children) { // Получаем всех детей элемента
            if (!n.classList) continue // Если у ребенка нет классов переходим дальше

            if (isActMsg && n.classList.contains("im-mess--text")) // Если это кик или другое действие добавляем кик к ним
                action_mutation_act(n)

            if (n.classList.contains('im-mess--actions'))  // Если это группа действий и в ней нет наших кнопок - добавляем их
                mutation_act(n)
        }
    }
}