import GlobalConfig from '../GlobalConfig';
import {Logger} from "../classes/Logger";
import {querySelectorWithTimeout} from "../common/helpers/querySelectorWithTimeout";

interface PVAddonsContext {
    pvPhoto: HTMLDivElement;
    pvBox: HTMLElement;
    pvBottomInfo: HTMLDivElement;
}

export default async function pv_addons() {
    const isPvExpand = GlobalConfig.Config.get('pvExpand') as boolean;
    const pvPhotoSwitchWheel = GlobalConfig.Config.get('pvPhotoSwitchWheel') as boolean;
    if (!isPvExpand && !pvPhotoSwitchWheel) {
        return;
    }

    const pvBox = await querySelectorWithTimeout<HTMLDivElement>({selectors: '#pv_box'});
    if (!pvBox) {
        return;
    }

    const pvBottomInfo = await querySelectorWithTimeout<HTMLDivElement>({
        element: pvBox,
        selectors: '.pv_bottom_info'
    });
    if (!pvBottomInfo) {
        Logger.info('pv_bottom_info not found');
        return;
    }

    const pvPhoto = await querySelectorWithTimeout<HTMLDivElement>({
        element: pvBox,
        selectors: `#pv_photo`
    });
    if (!pvPhoto) {
        Logger.info('pv_photo not found');
        return;
    }

    const context: PVAddonsContext = {
        pvPhoto, pvBox, pvBottomInfo,
    };
    if (isPvExpand) {
        try {
            pvExpand(context);
        } catch (e: any) {
            Logger.warn("Ошибка в expand.", {e});
        }
    }

    if (pvPhotoSwitchWheel) {
        try {
            photoSwitchWheel(context);
        } catch (e: any) {
            Logger.warn("Ошибка в photoSwitch.", {e});
        }
    }
}

let pvExpandClickValue: boolean = undefined;

function pvExpand({pvPhoto, pvBottomInfo,}: PVAddonsContext) {
    const buttonId = 'pv_expand_photo';
    if (document.getElementById(buttonId)) {
        return;
    }

    const pvBottomActions = pvBottomInfo.querySelector('.pv_bottom_actions') as HTMLDivElement | undefined;
    if (!pvBottomActions) {
        Logger.info('pv_bottom_actions not found');
        return;
    }

    const prependDivider = () => {
        const dividerEl = document.createElement('span');
        dividerEl.classList.add('divider');
        pvBottomActions.prepend(dividerEl);
    };

    prependDivider();
    const expandBtn = document.createElement('a');
    expandBtn.id = buttonId;
    expandBtn.style.setProperty('min-width', '68px');
    expandBtn.style.setProperty('display', 'inline-block');

    let prevObserver: MutationObserver | undefined = undefined;
    let stateExpand = false;
    // В этих переменных храним изначальное значение, которое задаёт сам VK.
    // После отмены сужения задаём их обратно.
    let prevWidth: any = undefined;
    let prevHeight: any = undefined;

    const switchExpand = async (value = !stateExpand) => {
        prevObserver?.disconnect();
        prevObserver = undefined;
        stateExpand = value;

        const imgExpand = (img: HTMLImageElement) => {
            img.style.setProperty('width', '100%', 'important');
            img.style.setProperty('height', '100%', 'important');
            img.style.setProperty('object-fit', 'contain', 'important');
            expandBtn.innerHTML = "Сузить";
            stateExpand = true;
        };

        const imgRemoveExpand = (img: HTMLImageElement) => {
            if (img.style.width !== '100%') {
                prevWidth = img.style.width;
                prevHeight = img.style.height;
            } else {
                img.style.removeProperty('width');
                img.style.removeProperty('height');
                if (prevWidth && prevHeight) {
                    img.style.setProperty('width', prevWidth);
                    img.style.setProperty('height', prevHeight);
                }
            }

            img.style.removeProperty('object-fit');
            expandBtn.innerHTML = "Расширить";
            stateExpand = false;
        }

        const applyChanges = async () => {
            const img = await querySelectorWithTimeout<HTMLImageElement>({
                element: pvPhoto,
                selectors: `img`
            });
            if (!img) {
                Logger.info('img not found');
                return;
            }

            value ? imgExpand(img) : imgRemoveExpand(img);
        };

        await applyChanges();
        const observer = new MutationObserver(applyChanges);
        observer.observe(pvPhoto, {childList: true});
        prevObserver = observer;
    };

    expandBtn.addEventListener('click', async () => {
        await switchExpand();
        pvExpandClickValue = stateExpand;
    });
    pvBottomActions.prepend(expandBtn);
    if (pvExpandClickValue !== undefined) {
        switchExpand(pvExpandClickValue);
        return;
    }

    if (!stateExpand && GlobalConfig.Config.get(window.screenLeft < 0 ? 'pvExpandLeftMonitorDefault' : 'pvExpandRightMonitorDefault')) {
        switchExpand(true);
        return
    }

    switchExpand(false);
}

function photoSwitchWheel({pvBox}: PVAddonsContext) {
    const pvImageWrap = pvBox.querySelector('.pv_image_wrap') as HTMLDivElement | undefined;
    if (!pvImageWrap) {
        Logger.info('pvImageWrap not found');
        return;
    }

    if (pvImageWrap.dataset.photoSwitchWheel === 'true') {
        // событие уже зарегистрировано
        return;
    }

    pvImageWrap.dataset.photoSwitchWheel = 'true';
    pvImageWrap.addEventListener('wheel', (e) => {
        const isNext = e.deltaY > 0;
        const isPrev = !isNext;
        const win = document.defaultView as any;
        win.cur.pvClicked = true;
        if (isNext) {
            win.Photoview.show(false, win.cur.pvIndex + 1, e);
        }

        if (isPrev) {
            win.Photoview.show(false, win.cur.pvIndex - 1, e);
        }
    })
}
