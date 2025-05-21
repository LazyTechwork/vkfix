export interface Album {
    id: number
    owner_id: number
    size: number
    title: string
}

export interface PhotoSize {
    height: number
    width: number
    type: 'base' | string
    url: string
}

export interface Photo {
    id: number
    owner_id: number
    album_id: number
    date: number
    has_tags: boolean
    orig_photo: PhotoSize
    sizes: PhotoSize[]
    text: string
}

export interface PhotoSticker {
    photo: Photo;
    suggestions: string[];
    lowerWords: string[];
}