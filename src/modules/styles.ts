export default function () {
    let style = document.createElement('style');
    style.innerHTML = `
    .im-mess 
    .vkfix-action{
        display: inline-block;
        vertical-align: top;
        width: 24px;
        height: 24px;
        visibility: hidden;
        outline: 0;
        user-select: none;
    }
    .im-mess:hover .vkfix-action{
        visibility: visible;
        transform: 1.2;
    }`;
    document.head.appendChild(style);
}
