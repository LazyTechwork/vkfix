type PrioritizedItem<T> = {
    value: T;
    priority: number;
};

export class PriorityArray<T> {
    #items: PrioritizedItem<T>[] = [];

    push(value: T, priority: number): void {
        this.#items.push({value, priority});
    }

    toArray(): T[] {
        return this.#items.sort((a, b) => b.priority - a.priority).map(x => x.value);
    }
}