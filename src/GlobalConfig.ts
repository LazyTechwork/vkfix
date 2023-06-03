import GM_config from './libs/GM_config';

export const defaultBotButtons = [{
    icon: 'И',
    text: 'Исключить',
    command: 'кик'
}, {
    icon: '+',
    text: 'Плюсануть',
    command: '+'
}, {
    icon: 'С',
    text: 'Статистика',
    command: 'стата'
}];

export default class GlobalConfig {
    static Config = new GM_config({
        'id': 'vkfix',
        'title': 'Настройка VK Fix',
        'fields': {
            'amadeus': {
                'label': 'Дополнительные кнопки для ботов в беседах',
                'type': 'checkbox',
                'default': true,
                'section': ['Настройки модулей', 'Не забудьте перезагрузить страницу']
            },
            'conversationKick': {
                'label': 'Дополнительная кнопка "исключить" в беседах',
                'type': 'checkbox',
                'default': false,
            },
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
                'default': false,
            },
            'logging': {
                'label': 'Логирование в консоль',
                'type': 'checkbox',
                'default': false,
            },
            'botName': {
                'label': 'Алиас для обращения к боту',
                'type': 'text',
                'default': 'Амадеус',
            },
            'botAction': {
                'label': 'Кнопки для ботов в беседах в виде JSON',
                'type': 'textarea',
                'default': JSON.stringify(defaultBotButtons),
            },
            "newsBtn": {
                'label': 'Ссылка на новости в профиле пользователя',
                'type': 'checkbox',
                'default': false,
            }
        }
    });
}
