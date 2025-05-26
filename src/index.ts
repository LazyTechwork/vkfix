// ==UserScript==
// @name VK Fix
// @description Скрипт для улучшения интерфейса ВКонтакте
// @author Ivan Petrov (LazyTechwork)
// @contributors Ivan Mel (ivanmem)
// @license MIT
// @version 1.1.13
// @include https://vk.com/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant unsafeWindow
// ==/UserScript==

import styles from './modules/styles';
import {mutationHandler} from './modules/mutations/mutationHandler';
import {GlobalConfig} from './GlobalConfig';
import {LocationState} from './classes/LocationState';
import {pageScanner} from './modules/pageScanner';
import {pvAddons} from './modules/pvAddons';
import {Logger} from "./classes/Logger";
import {profileActions} from "./modules/profileActions";
import {querySelectorWithTimeout} from "./common/helpers/querySelectorWithTimeout";
import {appActions} from "./modules/appActions";
import {messenger} from "./modules/messenger/messenger";

(async function (window) { // Используем замыкание для запуска нашего скрипта
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
        const settings_link = await querySelectorWithTimeout({selectors: '#top_settings_link', timeout: 5000});
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

        const onLoadWindow = () => {
            styles(); // Инъекция стилей
            pageScanner(); // Инициализируем сканер страницы
            mutationHandler(); // Регистрируем модуль слежения за мутациями
            pvAddons(); // Инициализируем дополнения к просмотрщику фото
            profileActions(); // Инициализируем дополнения к профилю пользователя
            appActions(); // Инициализируем дополнения к приложениям
            messenger(); // Инициализируем дополнения к мессенджеру
            window.removeEventListener("load", onLoadWindow);
            // Слежение за изменениями в URL
            LocationState.init();
        };

        window.addEventListener("load", onLoadWindow);
    }
})(window);
