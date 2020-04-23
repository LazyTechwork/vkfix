export default function () {
    let style = document.createElement('style');
    style.innerHTML = '.im-mess .vkfix-action{display:inline-block;vertical-align:top;width:24px;height:24px;visibility:hidden;outline:0}.im-mess:hover .vkfix-action{visibility:visible}';
    document.head.appendChild(style);
}