export default class VKLocation {
  static getQueryParams(): URLSearchParams {
    return new URLSearchParams(window.location.search);
  }

  static getConversation(): number | null {
    const params: URLSearchParams = this.getQueryParams();
    const selected = params.get('sel');
    if (!selected || !selected.startsWith('c')) {
      return null;
    }
    return parseInt(selected.substr(1));
  }

  static isConversation(): boolean {
    const params: URLSearchParams = this.getQueryParams();
    const selected = params.get('sel');
    if (!selected) {
      return false;
    }
    return selected.startsWith('c');
  }
}
