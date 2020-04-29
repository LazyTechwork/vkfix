import message_mutations, {action_mutation_act, mutation_act} from "./message_mutations";

export default function () {
// При инциализации скрипта пробегаемся по всем сообщениям и добавляем кнопки
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

    // Настраиваем слежение мутаций в DOM
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            message_mutations(mutation)
        });
    });
    observer.observe(document.body, {childList: true, subtree: true}); // Включаем нашего следящего на body
}
