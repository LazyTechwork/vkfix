export function extractPath(href: string): string {
    try {
        const url = new URL(href);
        return url.pathname + url.search + url.hash;
    } catch {
        // На случай если передан относительный URL или некорректная строка
        const a = document.createElement('a');
        a.href = href;
        return a.pathname + a.search + a.hash;
    }
}