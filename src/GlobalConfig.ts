import GM_config from "./libs/GM_config";

export const defaultBotButtons = [{
    icon: 'И',
    text: "Исключить",
    command: 'кик'
}, {
    icon: '+',
    text: "Плюсануть",
    command: '+'
}, {
    icon: 'С',
    text: "Статистика",
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
            'botName': {
                'label': 'Алиас для обращения к боту',
                'type': 'text',
                'default': 'Амадеус',
            },
            'botAction': {
                'label': 'Кнопки для ботов в беседах в виде JSON',
                'type': 'textarea',
                'default':  JSON.stringify(defaultBotButtons),
            }
        }
    });
}
