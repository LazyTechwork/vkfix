export default function () {
    let style = document.createElement('style');
    style.innerHTML = '.im-mess .vkfix-action {\n' +
        '    display: inline-block;\n' +
        '    vertical-align: top;\n' +
        '    width: 24px;\n' +
        '    height: 24px;\n' +
        '    visibility: hidden;\n' +
        '    outline: 0;\n' +
        '}\n' +
        '\n' +
        '.im-mess:hover .vkfix-action {\n' +
        '    visibility: visible;\n' +
        '}';
    document.head.appendChild(style);
}