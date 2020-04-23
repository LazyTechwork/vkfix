import GM_config from "./libs/GM_config";

export default class GlobalConfig {
    static Config = new GM_config({
        'id': 'vkfix',
        'title': 'Настройка VK Fix',
        'fields': {
            'amadeus': {
                'label': 'Управление конференциями при помощи Амадеуса',
                'type': 'checkbox',
                'default': true,
                'section': ['Настройки модулей', 'Не забудьте перезагрузить страницу']
            }
        }
    });
}