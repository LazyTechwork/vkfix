// ==UserScript==
// @name VK Fix
// @description Скрипт для улучшения интерфейса ВКонтакте
// @author Ivan Petrov (LazyTechwork)
// @license MIT
// @version 1.0.0
// @include https://vk.com/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// ==/UserScript==

import hover_kick from "./hover_kick";
import styles from "./styles";
import GM_config from "./libs/GM_config.js";

(function (window, undefined) {  // [2] нормализуем window
    let w = window;

    // В юзерскрипты можно вставлять практически любые javascript-библиотеки.
    // Код библиотеки копируется прямо в юзерскрипт.
    // При подключении библиотеки нужно передать w в качестве параметра окна window
    // Пример: подключение jquery.min.js
    // (function(a,b){function ci(a) ... a.jQuery=a.$=d})(w);

    // [3] не запускаем скрипт во фреймах
    // без этого условия скрипт будет запускаться несколько раз на странице с фреймами

    if (w.self != w.top) {
        return;
    }

    let cfg = new GM_config({
        'id': 'vkfix',
        'title': 'Настройка VK Fix',
        'fields': {
            'hover_kick': {
                'label': 'Дополнительные действия в сообщениях', // Appears next to field
                'type': 'checkbox', // Makes this setting a text field
                'default': true // Default value if user doesn't change it
            }
        }
    });
    GM_registerMenuCommand('Настройка', () => {
        cfg.open()
    })

    // [4] дополнительная проверка наряду с @include
    if (/https:\/\/vk.com/.test(w.location.href)) {
        console.log("VK Fix запущен")
        styles()
        if (cfg.get('hover_kick'))
            hover_kick()
    }
})(window);
