import AmadeusButton from "../../classes/AmadeusButton";
import AmadeusConfig from "../../classes/AmadeusConfig";
import message_mutations from "./message_mutations";

export default function () {
// При инциализации скрипта пробегаемся по всем сообщениям и добавляем кнопки
    for (const n of document.getElementsByClassName('im-mess--actions'))
        AmadeusButton.addButtons(AmadeusConfig.Global, n);

    // Настраиваем слежение мутаций в DOM
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            message_mutations(mutation)
        });
    });
    observer.observe(document.body, {childList: true, subtree: true}); // Включаем нашего следящего на body
}