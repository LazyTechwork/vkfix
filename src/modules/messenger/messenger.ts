import {Logger} from "../../classes/Logger";
import {GlobalConfig} from "../../GlobalConfig";
import {querySelectorWithTimeout} from "../../common/helpers/querySelectorWithTimeout";
import {APIInteractor} from "../../classes/ApiInteractor";
import {extractQuotedTexts} from "../../common/helpers/extractQuotedTexts";
import {createApp, h, shallowReactive} from "vue";
import StickersPopup from "./StickersPopup.vue";
import {VKLocation} from "../../classes/VKLocation";
import {Album, Photo, PhotoSticker} from "./types";
import {PriorityArray} from "../../classes/PriorityArray";


const isPhotoStickers = GlobalConfig.Config.get('messenger.photo-stickers') as boolean;
let _initPhotoStickers = false

const stickersStore = shallowReactive<{
    photos: PhotoSticker[]
    stickers: PhotoSticker[]
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
        })
        getSpanEditableEl().textContent = ''
    }
})

function getSpanEditableEl() {
    return document.querySelector<HTMLSpanElement>('.ComposerInput__input')
}

export async function messenger() {
    if (!isPhotoStickers) {
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

    spanEditableEl.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            return
        }

        setTimeout(() => {
            stickersStore.stickers = []
            Logger.info(`messenger: keydown ${e.key}, text: ${spanEditableEl.textContent}`)
            showStickers(spanEditableEl.textContent)
        })
    })

    Logger.info('messenger sucess!', spanEditableEl)
}

function getWords(str: string) {
    return str.toLocaleLowerCase().split(/[^а-яa-z0-9]/g).filter(x => x.length > 0)
}

async function initPhotoStickers() {
    if (!isPhotoStickers || _initPhotoStickers) {
        return
    }

    _initPhotoStickers = true

    try {
        const albumsResult = await APIInteractor.callApi({
            method: 'photos.getAlbums',
            data: {
                need_system: 1,
            }
        })
        const albums: Album[] = albumsResult.response.items

        for (const album of albums) {
            const photosResult = await APIInteractor.callApi({
                method: 'photos.get',
                data: {
                    album_id: album.id,
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
                            lowerWords: suggestions.map(s => getWords(s)).flat(),
                        })
                    }
                }
            }
        }

        const stickersAppEl = document.createElement('div')
        document.body.appendChild(stickersAppEl)
        const app = createApp({render: () => h(StickersPopup, stickersStore)});
        app.mount(stickersAppEl);
    } catch (ex: any) {
        Logger.error('messenger: initPhotoStickers', ex)
        stickersStore.photos = []
        stickersStore.stickers = []
        _initPhotoStickers = false
    }
}

async function showStickers(text: string) {
    await initPhotoStickers()
    const words = getWords(text)
    Logger.info(`messenger words`, words)
    const newStickers = new PriorityArray<PhotoSticker>()
    for (const photo of stickersStore.photos) {
        const foundedWords = words.filter(word => photo.lowerWords.includes(word))
        if (foundedWords.length) {
            newStickers.push(photo, foundedWords.length)
        }
    }

    stickersStore.stickers = newStickers.toArray()
    if (!stickersStore.stickers.length) {
        Logger.info('messenger: not found stickers')
        return
    }

    Logger.info('messenger: found stickers', stickersStore.stickers)
}