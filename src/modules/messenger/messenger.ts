import {Logger} from "../../classes/Logger";
import {GlobalConfig} from "../../GlobalConfig";
import {querySelectorWithTimeout} from "../../common/helpers/querySelectorWithTimeout";
import {APIInteractor} from "../../classes/ApiInteractor";
import {extractQuotedTexts} from "../../common/helpers/extractQuotedTexts";
import {createApp, h, shallowReactive} from "vue";
import StickersPopup from "./StickersPopup.vue";
import {VKLocation} from "../../classes/VKLocation";
import {Album, Photo, PhotoSticker} from "./types";
import {smartStickerSearch} from "../../classes/AdvancedStickerFilter";
import {debounce} from "es-toolkit";


const isEnabledPhotoStickers = GlobalConfig.Config.get('messenger.photo-stickers') as boolean;
const photoStickersAlbumIds = GlobalConfig.Config.get('messenger.photo-stickers.albums') as string;
let _initPhotoStickers = false

const stickersStore = shallowReactive<{
    photos: PhotoSticker[]
    stickers: PhotoSticker[]
    teleportEl?: HTMLDivElement
    onSendSticker(sticker: PhotoSticker): void
}>({
    photos: [], stickers: [], onSendSticker: (sticker: PhotoSticker) => {
        stickersStore.stickers = []
        Logger.info('messenger: onSendSticker', sticker)
        const peer_id = VKLocation.getPeerId()
        if (peer_id === undefined) {
            Logger.info('messenger: not found peer_id', VKLocation.getQueryParams())
            return
        }
        APIInteractor.callApi({
            method: 'messages.send',
            data: {
                peer_id,
                random_id: Math.round(Math.random() * 10000000),
                attachment: `photo${sticker.photo.owner_id}_${sticker.photo.id}`,
            }
        }).then(() => {
            setTimeout(() => {
                const el = document.querySelector(`.ConvoHistory__wrapper > div[data-scrollbar="scrollable"]`)
                if (el) {
                    el.scrollTo(0, el.scrollHeight)
                }
            }, 200)

        })
        getSpanEditableEl().textContent = ''
    }
})

function getSpanEditableEl() {
    return document.querySelector<HTMLSpanElement>('.ComposerInput__input')
}

export async function messenger() {
    if (!isEnabledPhotoStickers) {
        return
    }

    // const reforgedRootEl = await querySelectorWithTimeout({selectors: '#reforged-root'});
    const reforgedRootEl = document.getElementById('reforged-root');
    if (!reforgedRootEl) {
        Logger.info('messenger: not found #reforged-root')
        return;
    }

    const popupStickerEl = await querySelectorWithTimeout({
        selectors: `#popup-sticker-convo-main-history-container`
    });
    if (!popupStickerEl) {
        Logger.info('messenger: not found #popup-sticker-convo-main-history-container')
        return;
    }

    const spanEditableEl = getSpanEditableEl()
    if (!spanEditableEl) {
        Logger.info('messenger: not found .ComposerInput__input')
        return
    }

    spanEditableEl.addEventListener('input', initPhotoStickers)
    spanEditableEl.addEventListener('focus', () => {
        showStickers(spanEditableEl.textContent)
    })

    const debounceStickers = debounce(showStickers, 200)

    spanEditableEl.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            return
        }

        if (e.key === 'Escape') {
            stickersStore.stickers = []
            return
        }

        setTimeout(() => {
            stickersStore.stickers = []
            Logger.info(`messenger: keydown ${e.key}, text: ${spanEditableEl.textContent}`)
            debounceStickers(spanEditableEl.textContent)
        })
    })

    stickersStore.teleportEl = document.querySelector('.ConvoComposer__inputPanel')
    await showStickers(spanEditableEl.textContent)
    Logger.info('messenger sucess!', spanEditableEl)
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

async function initPhotoStickers() {
    if (!isEnabledPhotoStickers || _initPhotoStickers) {
        return
    }

    _initPhotoStickers = true
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
    } catch (ex: any) {
        Logger.error('messenger: initPhotoStickers', ex)
        stickersStore.photos = []
        stickersStore.stickers = []
        _initPhotoStickers = false
    }
}

async function showStickers(text: string) {
    if (text === '') {
        stickersStore.stickers = []
        return
    }

    await initPhotoStickers()
    const textLower = text.toLocaleLowerCase()
    const words = getWords(textLower)
    Logger.info(`messenger words`, words)
    stickersStore.stickers = smartStickerSearch(stickersStore.photos, textLower);
    Logger.info(`messenger find stickers`, stickersStore.stickers)
    if (!stickersStore.stickers.length) {
        Logger.info('messenger: not found stickers')
        return
    }

    Logger.info('messenger: found stickers', stickersStore.stickers)
}