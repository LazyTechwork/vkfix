
export default function () {
    // Настраиваем слежение мутаций в DOM
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // TODO обработать мутации, если нужно
        });
    });
    observer.observe(document.body, {childList: true, subtree: true}); // Включаем нашего следящего на body
}
