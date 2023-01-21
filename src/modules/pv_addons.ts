import GlobalConfig from '../GlobalConfig';
import {Logger} from "../classes/Logger";

interface PVAddonsContext {
    pvPhoto: HTMLDivElement;
    pvBox: HTMLElement;
    pvBottomInfo: HTMLDivElement;
}

export default function () {
    const isPvExpand = GlobalConfig.Config.get('pvExpand') as boolean;
    const pvPhotoSwitchWheel = GlobalConfig.Config.get('pvPhotoSwitchWheel') as boolean;
    if (!isPvExpand && !pvPhotoSwitchWheel) {
        return;
    }

    const pvBox = document.getElementById('pv_box');
    if (!pvBox) {
        return;
    }

    const pvBottomInfo = pvBox.querySelector('.pv_bottom_info') as HTMLDivElement | undefined;
    if (!pvBottomInfo) {
        Logger.info('pv_bottom_info not found');
        return;
    }

    const pvPhoto = pvBox.querySelector(`#pv_photo`) as HTMLDivElement | undefined;
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

function pvExpand({pvPhoto, pvBox, pvBottomInfo,}: PVAddonsContext) {
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
    expandBtn.id = 'pv_expand_photo';
    expandBtn.innerHTML = `Расширить`;
    expandBtn.title = 'Быстрая клавиша: e или +';
    let stateExpand = false;

    const switchExpand = () => {
        const img = pvPhoto.querySelector(`img`) as HTMLImageElement | undefined;
        if (!img) {
            Logger.info('img not found');
            return;
        }

        if (stateExpand) {
            img.style.removeProperty('width');
            img.style.removeProperty('height');
            img.style.removeProperty('object-fit');
        } else {
            img.style.setProperty('width', '100%', 'important');
            img.style.setProperty('height', '100%', 'important');
            img.style.setProperty('object-fit', 'contain', 'important');
        }

        stateExpand = !stateExpand;
    };

    expandBtn.addEventListener('click', switchExpand);
    const keydownTargets = [pvBox, pvPhoto, pvBottomActions, pvBottomInfo];
    pvBox.addEventListener('keydown', (e) => {
        if (keydownTargets.some(x => x === e.target) && e.key === '+' || e.code === 'KeyE') {
            e.stopPropagation();
            e.preventDefault();
            switchExpand();
        }
    });

    pvBottomActions.prepend(expandBtn);
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
