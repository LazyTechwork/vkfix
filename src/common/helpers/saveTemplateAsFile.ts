
export function saveTemplateAsFile(filename: string, dataObjToWrite: Record<any, any>) {
    const window: Window = unsafeWindow
    const blob = new Blob([JSON.stringify(dataObjToWrite)], {type: "text/json"});
    const link = document.createElement("a");

    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove()
}