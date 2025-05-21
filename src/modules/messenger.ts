import {Logger} from "../classes/Logger";
import {GlobalConfig} from "../GlobalConfig";
import {querySelectorWithTimeout} from "../common/helpers/querySelectorWithTimeout";
import {APIInteractor} from "../classes/ApiInteractor";
import {extractQuotedTexts} from "../common/helpers/extractQuotedTexts";

interface Album {
    id: number
    owner_id: number
    size: number
    title: string
}

interface PhotoSize {
    height: number
    width: number
    type: 'base' | string
    url: string
}

interface Photo {
    id: number
    owner_id: number
    album_id: number
    date: number
    has_tags: boolean
    orig_photo: PhotoSize
    sizes: PhotoSize[]
    text: string
}

const isPhotoStickers = GlobalConfig.Config.get('messenger.photo-stickers') as boolean;
let _initPhotoStickers = false
const findPhotos: { photo: Photo; suggestions: string[] }[] = []

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

    const spanEditableEl = document.querySelector('.ComposerInput__input')
    if (!spanEditableEl) {
        Logger.info('messenger: not found .ComposerInput__input')
        return
    }

    spanEditableEl.addEventListener('input', (e) => {
        initPhotoStickers()
        Logger.info('messenger: spanEditableEl.textContent', spanEditableEl.textContent)
    })
    Logger.info('messenger sucess!', spanEditableEl)
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
                        findPhotos.push({photo, suggestions})
                    }
                }
            }
        }

        console.log({findPhotos})
    } catch (ex: any) {
        Logger.error('messenger: initPhotoStickers', ex)
        findPhotos.length = 0
        _initPhotoStickers = false
    }
}

