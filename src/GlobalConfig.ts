import GM_config from './libs/GM_config';

export class GlobalConfig {
    static Config = new GM_config({
        'id': 'vkfix',
        'title': 'Настройка VK Fix',
        'fields': {
            'fixImagesZooming': {
                'label': 'Исправить зумирование картинок при нестандартном масштабировании в операционной системе windows (может быть и других)',
                'type': 'checkbox',
                'default': false,
            },
            'fixLeftMenuOverflow': {
                'label': 'Исправить высоту левого меню так, чтобы не создавался скролл страницы.',
                'type': 'checkbox',
                'default': false,
            },
            'pvExpand': {
                'label': 'Кнопка "Расширить" при просмотре фото (работает только с исправленным зумированием)',
                'type': 'checkbox',
                'default': false,
            },
            'pvExpandRightMonitorDefault': {
                'label': 'Кнопка "Расширить" будет нажиматься автоматически на (основном!) правом мониторе',
                'type': 'checkbox',
                'default': false,
            },
            'pvExpandLeftMonitorDefault': {
                'label': 'Кнопка "Расширить" будет нажиматься автоматически на (дополнительном!) левом мониторе',
                'type': 'checkbox',
                'default': false,
            },
            'pvPhotoSwitchWheel': {
                'label': 'Переключение фото колёсиком мыши',
                'type': 'checkbox',
                'default': true,
            },
            'pvPhotoMoreActCommunityKeeper': {
                'label': 'Кнопка "Открыть в Хранителе Групп"',
                'type': 'checkbox',
                'default': true,
            },
            'pvPhotoMoreActAlbum': {
                'label': 'Кнопка "Открыть в альбоме"',
                'type': 'checkbox',
                'default': true,
            },
            'exportCommunityKeeperBtn': {
                'label': 'Кнопка "Создать бэкап из всех сообществ" возле приложения Хранитель Групп',
                'type': 'checkbox',
                'default': false,
            },
            'logging': {
                'label': 'Логирование в консоль',
                'type': 'checkbox',
                'default': false,
            },
            "newsBtn": {
                'label': 'Ссылка на новости в профиле пользователя',
                'type': 'checkbox',
                'default': false,
            },
            "messenger.photo-stickers": {
                'label': 'Всплывающие подсказки из фотографий из альбомов с описанием',
                'type': 'checkbox',
                'default': false,
            },
            "messenger.photo-stickers.albums": {
                'label': 'Показывать всплывающие подсказки только для указанных ID альбомов (Сохранённые фотографии: -15). Например у вас открыт альбом https://vk.com/album123456_123, где 123 - id альбома. Очистите поле, чтобы загружать все альбомы (это медленно и есть вероятность поймать капчу).',
                'type': 'text',
                'default': '-15,',
            }
        }
    });
}
