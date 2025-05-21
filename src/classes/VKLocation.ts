export class VKLocation {
  static getQueryParams(): URLSearchParams {
    return new URLSearchParams(window.location.search);
  }

  static getPeerId(): number | undefined {
    const match = window.location.pathname.match(/\/im\/convo\/(-?\d+)/);
    return match ? parseInt(match[1], 10) : undefined;
  }

  static isConversation(): boolean {
    const peerId = this.getPeerId();
    return peerId >= 2000000000;
  }
}
