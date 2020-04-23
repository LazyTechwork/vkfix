export default class VKLocation {
    static getQueryParams(): URLSearchParams {
        return new URLSearchParams(window.location.search);
    }

    static isConversation(): boolean {
        const params: URLSearchParams = this.getQueryParams()
        const selected = params.get('sel')
        if (!selected) return false
        return selected.startsWith('c');
    }
}