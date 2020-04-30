import message_mutations from "./message_mutations";

export default function () {
    // Настраиваем слежение мутаций в DOM
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            message_mutations(mutation)
        });
    });
    observer.observe(document.body, {childList: true, subtree: true}); // Включаем нашего следящего на body
}
