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
// ==/UserScript==

import styles from './modules/styles';
import mutation_handler from './modules/mutations/mutation_handler';
import GlobalConfig from './GlobalConfig';
import LocationState from './classes/LocationState';
import page_scanner from './modules/page_scanner';
import pv_addons from './modules/pv_addons';
import {Logger} from "./classes/Logger";
import profile_actions from "./modules/profile_actions";

(function (window, undefined) { // Используем замыкание для запуска нашего скрипта
    let w = window;

    if (w.self != w.top) {
        return;
    }

    // TODO: Сделать свой конфигуратор, основанный на стилях ВКонтакте

    // Инициализируем новый конфиг

    // [4] дополнительная проверка наряду с @include
    if (/https:\/\/vk.com/.test(w.location.href)) {
        Logger.log('VK Fix запущен');

        // Добавляем кнопку настроек в верхнее меню
        const settings_link = document.getElementById('top_settings_link');
        if (settings_link?.parentNode) {
            const vkfixconflink = document.createElement('a');
            vkfixconflink.innerHTML = 'VK Fix';
            vkfixconflink.id = 'top_vkfix_settings_link';
            vkfixconflink.className = 'top_profile_mrow';
            vkfixconflink.setAttribute('href', '#');
            settings_link.parentNode.insertBefore(vkfixconflink, settings_link.nextSibling); // Вставляем после ссылки на
            // настройки
            vkfixconflink.addEventListener('click', (ev) => {
                ev.preventDefault();
                GlobalConfig.Config.open();
            });
        }

        styles(); // Инъекция стилей
        page_scanner(); // Инициализируем сканер страницы
        setTimeout(pv_addons, 1000); // Инициализируем дополнения к просмотрщику фото
        profile_actions(); // Инициализируем дополнения к профилю пользователя
        mutation_handler(); // Регистрируем модуль слежения за мутациями

        // Слежение за изменениями в URL
        LocationState.init();
    }
})(window);
