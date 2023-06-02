import GlobalConfig from '../GlobalConfig';
import {fixImagesZoomingCss} from './fix_images_zooming';
import {fixLeftMenuOverflow} from "./fix_left_menu_overflow";

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
    }`;
    const fixImagesZoomingEnabled = GlobalConfig.Config.get('fixImagesZooming');
    if (fixImagesZoomingEnabled) {
        style.innerHTML += fixImagesZoomingCss;
    }

    const fixLeftMenuOverflowEnabled = GlobalConfig.Config.get('fixLeftMenuOverflow');
    if (fixLeftMenuOverflowEnabled) {
        style.innerHTML += fixLeftMenuOverflow;
    }

    document.head.appendChild(style);
}
