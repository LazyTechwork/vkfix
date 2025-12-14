import {GlobalConfig} from '../GlobalConfig';
import {Logger} from "../classes/Logger";
import {querySelectorWithTimeout} from "../common/helpers/querySelectorWithTimeout";

interface PVAddonsContext {
    pvPhoto: HTMLDivElement;
    pvBox: HTMLElement;
    pvBottomInfo: HTMLDivElement;
}

export async function pvAddons() {
    // Фикс навигации по фото в ленте - вызываем первым делом
    fixFeedPhotoNavigation();

    const isPvExpand = GlobalConfig.Config.get('pvExpand') as boolean;
    const pvPhotoSwitchWheel = GlobalConfig.Config.get('pvPhotoSwitchWheel') as boolean;
    const pvPhotoMoreActCommunityKeeper = GlobalConfig.Config.get('pvPhotoMoreActCommunityKeeper') as boolean;
    const pvPhotoMoreActAlbum = GlobalConfig.Config.get('pvPhotoMoreActAlbum') as boolean;
    if (!isPvExpand && !pvPhotoSwitchWheel && !pvPhotoMoreActCommunityKeeper && !pvPhotoMoreActAlbum) {
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
            Logger.warn("Ошибка в photoSwitchWheel.", {e});
        }
    }

    if (pvPhotoMoreActCommunityKeeper || pvPhotoMoreActAlbum) {
        try {
            photoMoreActs(context);
        } catch (e: any) {
            Logger.warn("Ошибка в photoMoreActs.", {e});
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

    const win = document.defaultView as any;
    pvImageWrap.dataset.photoSwitchWheel = 'true';
    pvImageWrap.addEventListener('wheel', (e) => {
        const isNext = e.deltaY > 0;
        const isPrev = !isNext;
        if (isNext) {
            win.Photoview.show(false, win.cur.pvIndex + 1);
        }

        if (isPrev) {
            win.Photoview.show(false, win.cur.pvIndex - 1);
        }
    })
}

let initPhotoMoreActs = false
let abortControllerPhotoMoreActs = new AbortController()

function photoMoreActs({pvBox}: PVAddonsContext) {
    const pvImageWrap = pvBox.querySelector('.pv_image_wrap') as HTMLDivElement | undefined;
    if (!pvImageWrap) {
        Logger.info('pvImageWrap not found');
        return;
    }

    const pvActionsMore = pvBox.querySelector<HTMLButtonElement>('.pv_actions_more')
    if (!pvActionsMore) {
        Logger.info('pvActionsMore not found');
        return
    }

    const pvPhotoMoreActCommunityKeeper = GlobalConfig.Config.get('pvPhotoMoreActCommunityKeeper') as boolean;
    const pvPhotoMoreActAlbum = GlobalConfig.Config.get('pvPhotoMoreActAlbum') as boolean;
    const actNames: ('pvPhotoMoreActCommunityKeeper' | 'pvPhotoMoreActAlbum')[] = []
    if (pvPhotoMoreActCommunityKeeper) {
        actNames.push('pvPhotoMoreActCommunityKeeper')
    }

    if (pvPhotoMoreActAlbum) {
        actNames.push('pvPhotoMoreActAlbum')
    }


    if (!initPhotoMoreActs && actNames.length) {
        const style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet.insertRule(`.pv_more_act_vkfix::before { background-position: 0 -60px; }`, 0);
        initPhotoMoreActs = true
    }

    abortControllerPhotoMoreActs.abort()
    abortControllerPhotoMoreActs = new AbortController()
    const signal = abortControllerPhotoMoreActs.signal

    const registerMoreAct = async (name: 'pvPhotoMoreActCommunityKeeper' | 'pvPhotoMoreActAlbum', textContent: string, href: string) => {
        if (pvActionsMore.querySelector(`#${name}`) || !cur.pvCurPhoto.id.startsWith('-')) {
            return
        }

        const pvMoreActDownload = await querySelectorWithTimeout<HTMLLinkElement>({
            selectors: '#pv_more_act_download',
            element: pvBox,
            timeout: 1000,
            signal,
        }).catch(() => undefined)

        if (!pvMoreActDownload) {
            return
        }

        if (pvActionsMore.querySelector(`#${name}`)) {
            return
        }

        signal.throwIfAborted()

        const pvMoreAct = pvMoreActDownload.cloneNode() as HTMLLinkElement
        pvMoreAct.id = name
        pvMoreAct.textContent = textContent
        pvMoreAct.href = href
        pvMoreAct.classList.add('pv_more_act_vkfix')
        pvMoreActDownload.parentElement.append(pvMoreAct)

        const pvMoreActsTt = pvBox.querySelector<HTMLDivElement>('#pv_more_acts_tt')
        if (pvMoreActsTt) {
            pvMoreActsTt.style.top = `${parseInt(pvMoreActsTt.style.top, 10) - 32}px`;
        }
    }

    const registerMoreActs = async () => {
        if (pvPhotoMoreActCommunityKeeper) {
            await registerMoreAct('pvPhotoMoreActCommunityKeeper', 'Открыть в Хранителе Групп', `https://${window.location.host}/app51658481#/photo${cur.pvCurPhoto.id}`)
        }

        const isPhotoPath = window.location.pathname.startsWith('/photo-')
        if (pvPhotoMoreActAlbum && !isPhotoPath) {
            await registerMoreAct('pvPhotoMoreActAlbum', 'Открыть в альбоме', `https://${window.location.host}/photo${cur.pvCurPhoto.id}`)
        }
    }

    pvActionsMore.addEventListener('mouseenter', registerMoreActs, {
        capture: true,
        signal,
    })
}

declare const cur: any

// Флаг что мы уже в процессе фикса (чтобы не реагировать на свои же изменения URL)
let isFixingFeedPhoto = false;
// Флаг что фотопросмотрщик уже открыт (чтобы не реагировать на переключение фото)
let isPhotoViewerActive = false;

/**
 * Фикс навигации по фото в ленте.
 * ВК добавляет хеш в URL фото (например /feed?z=photo-123_456%2Fabc123hash),
 * который ломает пролистывание. Мы убираем этот хеш, чтобы вернуть навигацию.
 */
function fixFeedPhotoNavigation() {
    const isEnabled = GlobalConfig.Config.get('fixFeedPhotoNavigation') as boolean;
    if (!isEnabled) {
        return;
    }

    // Если мы в процессе фикса - игнорируем
    if (isFixingFeedPhoto) {
        return;
    }

    const url = new URL(window.location.href);
    const zParam = url.searchParams.get('z');

    // Если z параметра нет - фотопросмотрщик закрыт
    if (!zParam) {
        isPhotoViewerActive = false;
        return;
    }

    // Если фотопросмотрщик уже активен - не реагируем на переключение фото
    if (isPhotoViewerActive) {
        return;
    }

    // Проверяем что есть параметр z с фото
    if (!zParam.startsWith('photo')) {
        return;
    }

    // Проверяем есть ли хеш в параметре (формат: photo-123_456%2Fhash или photo-123_456/hash)
    const decodedZ = decodeURIComponent(zParam);
    const slashIndex = decodedZ.indexOf('/');

    if (slashIndex === -1) {
        // Хеша нет, ничего делать не нужно
        return;
    }

    // Извлекаем только ID фото без хеша
    const photoId = decodedZ.substring(0, slashIndex);

    Logger.info('fixFeedPhotoNavigation: убираем хеш из URL фото', {
        original: zParam,
        photoId: photoId
    });

    // Устанавливаем флаги
    isFixingFeedPhoto = true;
    isPhotoViewerActive = true;

    // Шаг 1: replaceState с чистым URL (без хеша)
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.set('z', photoId);
    history.replaceState(null, "", cleanUrl.toString());

    // Шаг 2: pushState с тем же URL чтобы создать запись в истории
    history.pushState(null, "", cleanUrl.toString());

    // Шаг 3: back() чтобы React среагировал на изменение
    history.back();

    // Сбрасываем флаг фикса после небольшой задержки
    setTimeout(() => {
        isFixingFeedPhoto = false;
    }, 100);
}