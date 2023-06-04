interface GetElementBySelectorWithTimeoutOptions<TAll extends boolean> {
    /** @description Аналогично первому параметру для функции: document.querySelector.*/
    selectors: string;
    /** @description Если за указанное время элемент не будет найден - вернётся null. */
    timeout?: number;
    /** @description элемент, мутации которого будут отслеживаться. По умолчанию - documentElement. */
    element?: HTMLElement;
    /** @description Получить все элементы? */
    all?: TAll,
}

/** @description Получает элемент за указанный timeout с помощью наблюдения за мутациями в указанном элементе. */
export function querySelectorWithTimeout<T extends Element = HTMLElement, TAll extends boolean = false>({
    selectors,
    timeout = 2000,
    element = document.documentElement,
    all = false as TAll
}: GetElementBySelectorWithTimeoutOptions<TAll>): Promise<(typeof all extends true ? NodeListOf<T> : T) | undefined> {
    const getResult = (): any => {
        if (all) {
            const result = element.querySelectorAll<T>(selectors);
            if (result.length > 0) {
                return result;
            }

            return undefined;
        }

        const result = element.querySelector(selectors);
        if (result) {
            return result;
        }

        return undefined;
    };

    return new Promise((resolve) => {
        const result = getResult();
        if (result) {
            resolve(result);
            return;
        }

        const observer = new MutationObserver((_, observer) => {
            const result = getResult();
            if (result) {
                observer.disconnect();
                resolve(result);
            }
        });

        observer.observe(document.documentElement, {childList: true, subtree: true});
        setTimeout(() => {
            observer.disconnect();
            resolve(getResult());
        }, timeout);
    });
}
