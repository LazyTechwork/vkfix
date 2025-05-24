import {Logger} from "../../classes/Logger";
import {GlobalConfig} from "../../GlobalConfig";
import {querySelectorWithTimeout} from "../../common/helpers/querySelectorWithTimeout";
import {APIInteractor} from "../../classes/ApiInteractor";
import {extractQuotedTexts} from "../../common/helpers/extractQuotedTexts";
import {createApp, h, ref, shallowReactive, watch} from "vue";
import StickersPopup from "./StickersPopup.vue";
import {VKLocation} from "../../classes/VKLocation";
import {Album, Photo, PhotoSticker} from "./types";
import {initializeStickerSearch, smartStickerSearch} from "../../classes/AdvancedStickerFilter";
import {debounce} from "es-toolkit";
import {useEventListener} from "@vueuse/core";


const isEnabledPhotoStickers = GlobalConfig.Config.get('messenger.photo-stickers') as boolean;
const photoStickersAlbumIds = GlobalConfig.Config.get('messenger.photo-stickers.albums') as string;
let _initPhotoStickers = ref<boolean | null>(false) // null - идёт инициализация
const popupStickerEl = ref<HTMLDivElement | null>(null)
const convoMainComposer = ref<HTMLDivElement | null>(null)
const composerInputInput = ref<HTMLSpanElement | null>(null)
const messageText = ref('')
const debounceShowStickers = debounce(showStickers, 200)

useEventListener(composerInputInput, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
        return
    }

    if (e.key === 'Escape' || e.key === 'Enter' || !composerInputInput.value) {
        stickersStore.stickers = []
        return
    }

    setTimeout(() => {
        if (!composerInputInput.value) {
            return
        }

        stickersStore.stickers = []
        messageText.value = composerInputInput.value.textContent
        debounceShowStickers(composerInputInput.value.textContent)
        Logger.info(`messenger: keydown ${e.key}, text: ${composerInputInput.value.textContent}`)
    })
})

useEventListener(composerInputInput, 'input', initPhotoStickers)

useEventListener(composerInputInput, 'focus', () => {
    showStickers(composerInputInput.value.textContent).then()
})

watch(popupStickerEl, (popupStickerEl) => {
    if (!popupStickerEl) {
        return
    }

    convoMainComposer.value = popupStickerEl.querySelector('.ConvoMain__composer')
}, {flush: 'sync'})

watch(convoMainComposer, (convoMainComposer) => {
    if (!convoMainComposer) {
        return
    }

    composerInputInput.value = convoMainComposer.querySelector<HTMLSpanElement>('.ComposerInput__input')
    if (!composerInputInput.value) {
        Logger.info('messenger: not found .ComposerInput__input')
        return
    }
}, {flush: 'sync'})

watch(composerInputInput, (composerInputInput) => {
    if (!composerInputInput) {
        return
    }

    observer.disconnect()
    observer.observe(composerInputInput, observerConfig)
    stickersStore.teleportEl = convoMainComposer.value.querySelector('.ConvoComposer__inputPanel')
    messageText.value = composerInputInput.textContent
}, {flush: 'sync'})

watch([composerInputInput, messageText], () => {
    debounceShowStickers(messageText.value)
})

// возвращает инфу о текущем вводе сообщения (например reply)
async function getComposerDrafts(): Promise<ComposerDraft[]> {
    const peer_id = VKLocation.getPeerId()
    if (peer_id === undefined) {
        Logger.info('messenger: not found peer_id', VKLocation.getQueryParams())
        return
    }

    return (await MECommonContext).store.getState().composerDrafts?.[peer_id] ?? []
}

const stickersStore = shallowReactive<{
    photos: PhotoSticker[]
    stickers: PhotoSticker[]
    teleportEl?: HTMLDivElement
    onSendSticker(sticker: PhotoSticker): void
}>({
    photos: [], stickers: [], onSendSticker: async (sticker: PhotoSticker) => {
        stickersStore.stickers = []
        Logger.info('onSendSticker: sticker', sticker)
        const peer_id = VKLocation.getPeerId()
        if (peer_id === undefined) {
            Logger.info('onSendSticker: not found peer_id', VKLocation.getQueryParams())
            return
        }

        const composerDrafts = await getComposerDrafts()
        Logger.info('onSendSticker: composerDrafts', composerDrafts)
        const cmid: number | undefined = composerDrafts.length !== 1 ? undefined : composerDrafts[0]?.reply?.cmid
        await APIInteractor.callApi({
            method: 'messages.send',
            data: {
                peer_id,
                random_id: Math.round(Math.random() * 10000000),
                attachment: `photo${sticker.photo.owner_id}_${sticker.photo.id}`,
                forward: cmid === undefined ? undefined : JSON.stringify({
                    peer_id,
                    conversation_message_ids: cmid,
                    is_reply: 1,
                })
            }
        })

        // скроллим мессенджер вниз
        setTimeout(() => {
            const el = document.querySelector(`.ConvoHistory__wrapper > div[data-scrollbar="scrollable"]`)
            if (el) {
                el.scrollTo(0, el.scrollHeight)
            }
        }, 200)

        // сбрасываем текст с поля ввода
        if (composerInputInput.value) {
            composerInputInput.value.textContent = ''
        }

        // сбрасываем ответное сообщение
        if (cmid !== undefined) {
            const resetEl = document.querySelector<HTMLButtonElement>('#popup-sticker-convo-main-history-container .Composer__button.ComposerOverMessage__close')
            Logger.info('onSendSticker: resetEl', resetEl)
            resetEl.click()
        }
    }
})


const observerConfig: MutationObserverInit = {
    childList: true
};

const observerCallback: MutationCallback = (mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
            const text = composerInputInput.value?.textContent;
            if (!text) {
                Logger.info('messenger observer: content empty:');
                stickersStore.stickers = []
                return
            }
        }
    });
};

const observer = new MutationObserver(observerCallback);

function getConvoComposerEditing() {
    return popupStickerEl.value?.querySelector('.ConvoComposer__editing')
}

export async function messenger() {
    // при повторной инициализации сбрасываем предыдущие подсказки
    stickersStore.stickers = []

    if (!isEnabledPhotoStickers) {
        return
    }

    // const reforgedRootEl = await querySelectorWithTimeout({selectors: '#reforged-root'});
    const reforgedRootEl = document.getElementById('reforged-root');
    if (!reforgedRootEl) {
        Logger.info('messenger: not found #reforged-root')
        return;
    }

    popupStickerEl.value = await querySelectorWithTimeout<HTMLDivElement>({
        selectors: `#popup-sticker-convo-main-history-container`
    });
    if (!popupStickerEl.value) {
        Logger.info('messenger: not found #popup-sticker-convo-main-history-container')
        return;
    }

    Logger.info('messenger sucess!', composerInputInput.value)
}


function getWords(str: string) {
    return str.toLocaleLowerCase().split(/[^а-яa-z0-9]/g).filter(x => x.length > 0)
}

async function getAlbumsIds(): Promise<number[]> {
    const albumsIds: number[] = photoStickersAlbumIds
        .split(',')
        .map(x => x.trim())
        .filter(x => x.length)
        .map(x => Number(x))
    if (albumsIds.length > 0) {
        return albumsIds
    }

    const albumsResult = await APIInteractor.callApi({
        method: 'photos.getAlbums',
        data: {
            need_system: 1,
            album_ids: photoStickersAlbumIds,
        }
    })
    const albums: Album[] = albumsResult.response.items
    return albums.map(x => x.id)
}

async function initPhotoStickers(): Promise<void> {
    if (!isEnabledPhotoStickers || _initPhotoStickers.value === true) {
        return
    }

    // если инициализация уже идёт, ждем завершения
    if (_initPhotoStickers.value === null) {
        return new Promise((resolve) => {
            watch(_initPhotoStickers, () => {
                resolve()
            }, {once: true})
        })
    }

    _initPhotoStickers.value = null
    try {
        const albumIds = await getAlbumsIds()
        for (const album_id of albumIds) {
            const photosResult = await APIInteractor.callApi({
                method: 'photos.get',
                data: {
                    album_id,
                    count: 1000,
                }
            })
            const albumPhotos: Photo[] = photosResult.response.items

            for (const photo of albumPhotos) {
                if (photo.text) {
                    const suggestions = extractQuotedTexts(photo.text)
                    if (suggestions) {
                        stickersStore.photos.push({
                            photo,
                            suggestions,
                            lowerSuggestions: suggestions.map(s => s.toLocaleLowerCase()),
                            lowerWords: suggestions.map(s => getWords(s)).flat(),
                        })
                    }
                }
            }
        }

        const stickersAppEl = document.createElement('div')
        const app = createApp({render: () => h(StickersPopup, stickersStore)});
        app.mount(stickersAppEl);
        document.body.appendChild(stickersAppEl)
        initializeStickerSearch(stickersStore.photos)
        _initPhotoStickers.value = true
    } catch (ex: any) {
        Logger.error('messenger: initPhotoStickers', ex)
        stickersStore.photos = []
        stickersStore.stickers = []
        _initPhotoStickers.value = false
    }
}

async function showStickers(text: string) {
    if (text === '' || !composerInputInput.value) {
        stickersStore.stickers = []
        return
    }

    // Если найден сonvoComposerEditing, значит пользователь редактирует сообщение и подсказки отображать не нужно.
    if (getConvoComposerEditing()) {
        stickersStore.stickers = []
        return
    }

    await initPhotoStickers()
    if (_initPhotoStickers.value === false) {
        return
    }

    const textLower = text.toLocaleLowerCase()
    const words = getWords(textLower)
    Logger.info(`messenger words`, words)
    stickersStore.stickers = smartStickerSearch(stickersStore.photos, textLower);
    // предотвращаем появление стикеров после отправки сообщения
    if (composerInputInput.value.textContent !== text) {
        stickersStore.stickers = []
    }

    Logger.info(`messenger find stickers`, stickersStore.stickers)
    if (!stickersStore.stickers.length) {
        Logger.info('messenger: not found stickers')
        return
    }

    Logger.info('messenger: found stickers', stickersStore.stickers)
}