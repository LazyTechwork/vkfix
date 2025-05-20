// ==UserScript==
// @name VK Fix
// @description Скрипт для улучшения интерфейса ВКонтакте
// @author Ivan Petrov (LazyTechwork)
// @contributors Ivan Mel (xeleoss)
// @license MIT
// @version 1.1.6
// @include https://vk.com/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant unsafeWindow
// ==/UserScript==
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const consts_1 = __webpack_require__(6);
class Logger {
    static log(...args) {
        if (consts_1.isLog) {
            console.log(args);
        }
    }
    static info(...args) {
        if (consts_1.isLog) {
            console.info(args);
        }
    }
    static warn(...args) {
        if (consts_1.isLog) {
            console.warn(args);
        }
    }
    static error(...args) {
        if (consts_1.isLog) {
            console.error(args);
        }
    }
}
exports.Logger = Logger;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalConfig = void 0;
const GM_config_1 = __webpack_require__(13);
class GlobalConfig {
}
exports.GlobalConfig = GlobalConfig;
GlobalConfig.Config = new GM_config_1.default({
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
    }
});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.querySelectorWithTimeout = void 0;
/** @description Получает элемент за указанный timeout с помощью наблюдения за мутациями в указанном элементе. */
function querySelectorWithTimeout({ selectors, timeout = 2000, element = document.documentElement, all = false, signal, }) {
    const getResult = () => {
        if (all) {
            const result = element.querySelectorAll(selectors);
            if (result.length > 0) {
                return result;
            }
            return undefined;
        }
        const result = element.querySelector(selectors);
        if (result) {
            return result;
        }
        return undefined;
    };
    return new Promise((resolve, reject) => {
        const result = getResult();
        if (result) {
            resolve(result);
            return;
        }
        const observer = new MutationObserver((_, observer) => {
            if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                observer.disconnect();
                reject(signal.reason);
                return;
            }
            const result = getResult();
            if (result) {
                observer.disconnect();
                resolve(result);
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        setTimeout(() => {
            if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                observer.disconnect();
                reject(signal.reason);
                return;
            }
            observer.disconnect();
            resolve(getResult());
        }, timeout);
    });
}
exports.querySelectorWithTimeout = querySelectorWithTimeout;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _LocationState_previousQuery, _LocationState_previousHref, _LocationState_query, _LocationState_href, _LocationState_locUpdScanner;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationState = void 0;
const VKLocation_1 = __webpack_require__(17);
const locationMutations_1 = __webpack_require__(18);
const consts_1 = __webpack_require__(6);
const Logger_1 = __webpack_require__(0);
const extractPath_1 = __webpack_require__(21);
class LocationState {
    static init() {
        this.updateState();
        LocationState.locationScanner(); // Инициализируем слежение за изменениями в URL
    }
    static changeState(href, newQuery) {
        __classPrivateFieldSet(this, _a, __classPrivateFieldGet(this, _a, "f", _LocationState_query), "f", _LocationState_previousQuery);
        __classPrivateFieldSet(this, _a, __classPrivateFieldGet(this, _a, "f", _LocationState_href), "f", _LocationState_previousHref);
        __classPrivateFieldSet(this, _a, newQuery, "f", _LocationState_query);
        __classPrivateFieldSet(this, _a, href, "f", _LocationState_href);
    }
    static updateState() {
        this.changeState(location.href, VKLocation_1.VKLocation.getQueryParams());
        const getParamsQuery = (p) => {
            if (!p) {
                return null;
            }
            return {
                sel: p.get('sel'),
                z: p.get('z'),
            };
        };
        if (consts_1.isLog) {
            Logger_1.Logger.warn('Updated location', {
                previousQuery: getParamsQuery(__classPrivateFieldGet(this, _a, "f", _LocationState_previousQuery)),
                query: getParamsQuery(__classPrivateFieldGet(this, _a, "f", _LocationState_query)),
            });
        }
    }
    static get currentQuery() {
        return __classPrivateFieldGet(this, _a, "f", _LocationState_query);
    }
    static get previousQuery() {
        return __classPrivateFieldGet(this, _a, "f", _LocationState_previousQuery);
    }
    static get currentPath() {
        return (0, extractPath_1.extractPath)(__classPrivateFieldGet(this, _a, "f", _LocationState_href));
    }
    static get previousPath() {
        return (0, extractPath_1.extractPath)(__classPrivateFieldGet(this, _a, "f", _LocationState_previousHref));
    }
    static locationScanner() {
        if (__classPrivateFieldGet(this, _a, "f", _LocationState_locUpdScanner) !== null) {
            clearInterval(__classPrivateFieldGet(this, _a, "f", _LocationState_locUpdScanner));
        }
        __classPrivateFieldSet(this, _a, setInterval(() => {
            if (location.href !== __classPrivateFieldGet(this, _a, "f", _LocationState_href)) {
                (0, locationMutations_1.locationMutations)();
            }
        }, 100), "f", _LocationState_locUpdScanner);
    }
}
exports.LocationState = LocationState;
_a = LocationState;
_LocationState_previousQuery = { value: null };
_LocationState_previousHref = { value: null };
_LocationState_query = { value: null };
_LocationState_href = { value: null };
_LocationState_locUpdScanner = { value: null };


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.pageScanner = void 0;
function pageScanner() {
    // TODO обработать все изменения на странице, если требуется
}
exports.pageScanner = pageScanner;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pvAddons = void 0;
const GlobalConfig_1 = __webpack_require__(1);
const Logger_1 = __webpack_require__(0);
const querySelectorWithTimeout_1 = __webpack_require__(2);
function pvAddons() {
    return __awaiter(this, void 0, void 0, function* () {
        const isPvExpand = GlobalConfig_1.GlobalConfig.Config.get('pvExpand');
        const pvPhotoSwitchWheel = GlobalConfig_1.GlobalConfig.Config.get('pvPhotoSwitchWheel');
        const pvPhotoMoreActCommunityKeeper = GlobalConfig_1.GlobalConfig.Config.get('pvPhotoMoreActCommunityKeeper');
        const pvPhotoMoreActAlbum = GlobalConfig_1.GlobalConfig.Config.get('pvPhotoMoreActAlbum');
        if (!isPvExpand && !pvPhotoSwitchWheel && !pvPhotoMoreActCommunityKeeper && !pvPhotoMoreActAlbum) {
            return;
        }
        const pvBox = yield (0, querySelectorWithTimeout_1.querySelectorWithTimeout)({ selectors: '#pv_box' });
        if (!pvBox) {
            return;
        }
        const pvBottomInfo = yield (0, querySelectorWithTimeout_1.querySelectorWithTimeout)({
            element: pvBox,
            selectors: '.pv_bottom_info'
        });
        if (!pvBottomInfo) {
            Logger_1.Logger.info('pv_bottom_info not found');
            return;
        }
        const pvPhoto = yield (0, querySelectorWithTimeout_1.querySelectorWithTimeout)({
            element: pvBox,
            selectors: `#pv_photo`
        });
        if (!pvPhoto) {
            Logger_1.Logger.info('pv_photo not found');
            return;
        }
        const context = {
            pvPhoto, pvBox, pvBottomInfo,
        };
        if (isPvExpand) {
            try {
                pvExpand(context);
            }
            catch (e) {
                Logger_1.Logger.warn("Ошибка в expand.", { e });
            }
        }
        if (pvPhotoSwitchWheel) {
            try {
                photoSwitchWheel(context);
            }
            catch (e) {
                Logger_1.Logger.warn("Ошибка в photoSwitchWheel.", { e });
            }
        }
        if (pvPhotoMoreActCommunityKeeper || pvPhotoMoreActAlbum) {
            try {
                photoMoreActs(context);
            }
            catch (e) {
                Logger_1.Logger.warn("Ошибка в photoMoreActs.", { e });
            }
        }
    });
}
exports.pvAddons = pvAddons;
let pvExpandClickValue = undefined;
function pvExpand({ pvPhoto, pvBottomInfo, }) {
    const buttonId = 'pv_expand_photo';
    if (document.getElementById(buttonId)) {
        return;
    }
    const pvBottomActions = pvBottomInfo.querySelector('.pv_bottom_actions');
    if (!pvBottomActions) {
        Logger_1.Logger.info('pv_bottom_actions not found');
        return;
    }
    const prependDivider = () => {
        const dividerEl = document.createElement('span');
        dividerEl.classList.add('divider');
        pvBottomActions.prepend(dividerEl);
    };
    prependDivider();
    const expandBtn = document.createElement('a');
    expandBtn.id = buttonId;
    expandBtn.style.setProperty('min-width', '68px');
    expandBtn.style.setProperty('display', 'inline-block');
    let prevObserver = undefined;
    let stateExpand = false;
    // В этих переменных храним изначальное значение, которое задаёт сам VK.
    // После отмены сужения задаём их обратно.
    let prevWidth = undefined;
    let prevHeight = undefined;
    const switchExpand = (value = !stateExpand) => __awaiter(this, void 0, void 0, function* () {
        prevObserver === null || prevObserver === void 0 ? void 0 : prevObserver.disconnect();
        prevObserver = undefined;
        stateExpand = value;
        const imgExpand = (img) => {
            img.style.setProperty('width', '100%', 'important');
            img.style.setProperty('height', '100%', 'important');
            img.style.setProperty('object-fit', 'contain', 'important');
            expandBtn.innerHTML = "Сузить";
            stateExpand = true;
        };
        const imgRemoveExpand = (img) => {
            if (img.style.width !== '100%') {
                prevWidth = img.style.width;
                prevHeight = img.style.height;
            }
            else {
                img.style.removeProperty('width');
                img.style.removeProperty('height');
                if (prevWidth && prevHeight) {
                    img.style.setProperty('width', prevWidth);
                    img.style.setProperty('height', prevHeight);
                }
            }
            img.style.removeProperty('object-fit');
            expandBtn.innerHTML = "Расширить";
            stateExpand = false;
        };
        const applyChanges = () => __awaiter(this, void 0, void 0, function* () {
            const img = yield (0, querySelectorWithTimeout_1.querySelectorWithTimeout)({
                element: pvPhoto,
                selectors: `img`
            });
            if (!img) {
                Logger_1.Logger.info('img not found');
                return;
            }
            value ? imgExpand(img) : imgRemoveExpand(img);
        });
        yield applyChanges();
        const observer = new MutationObserver(applyChanges);
        observer.observe(pvPhoto, { childList: true });
        prevObserver = observer;
    });
    expandBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        yield switchExpand();
        pvExpandClickValue = stateExpand;
    }));
    pvBottomActions.prepend(expandBtn);
    if (pvExpandClickValue !== undefined) {
        switchExpand(pvExpandClickValue);
        return;
    }
    if (!stateExpand && GlobalConfig_1.GlobalConfig.Config.get(window.screenLeft < 0 ? 'pvExpandLeftMonitorDefault' : 'pvExpandRightMonitorDefault')) {
        switchExpand(true);
        return;
    }
    switchExpand(false);
}
function photoSwitchWheel({ pvBox }) {
    const pvImageWrap = pvBox.querySelector('.pv_image_wrap');
    if (!pvImageWrap) {
        Logger_1.Logger.info('pvImageWrap not found');
        return;
    }
    if (pvImageWrap.dataset.photoSwitchWheel === 'true') {
        // событие уже зарегистрировано
        return;
    }
    const win = document.defaultView;
    pvImageWrap.dataset.photoSwitchWheel = 'true';
    pvImageWrap.addEventListener('wheel', (e) => {
        const isNext = e.deltaY > 0;
        const isPrev = !isNext;
        if (isNext) {
            win.Photoview.show(false, win.cur.pvIndex + 1);
        }
        if (isPrev) {
            win.Photoview.show(false, win.cur.pvIndex - 1);
        }
    });
}
let initPhotoMoreActs = false;
let abortControllerPhotoMoreActs = new AbortController();
function photoMoreActs({ pvBox }) {
    const pvImageWrap = pvBox.querySelector('.pv_image_wrap');
    if (!pvImageWrap) {
        Logger_1.Logger.info('pvImageWrap not found');
        return;
    }
    const pvActionsMore = pvBox.querySelector('.pv_actions_more');
    if (!pvActionsMore) {
        Logger_1.Logger.info('pvActionsMore not found');
        return;
    }
    const pvPhotoMoreActCommunityKeeper = GlobalConfig_1.GlobalConfig.Config.get('pvPhotoMoreActCommunityKeeper');
    const pvPhotoMoreActAlbum = GlobalConfig_1.GlobalConfig.Config.get('pvPhotoMoreActAlbum');
    const actNames = [];
    if (pvPhotoMoreActCommunityKeeper) {
        actNames.push('pvPhotoMoreActCommunityKeeper');
    }
    if (pvPhotoMoreActAlbum) {
        actNames.push('pvPhotoMoreActAlbum');
    }
    if (!initPhotoMoreActs && actNames.length) {
        const style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet.insertRule(`.pv_more_act_vkfix::before { background-position: 0 -60px; }`, 0);
        initPhotoMoreActs = true;
    }
    abortControllerPhotoMoreActs.abort();
    abortControllerPhotoMoreActs = new AbortController();
    const signal = abortControllerPhotoMoreActs.signal;
    const registerMoreAct = (name, textContent, href) => __awaiter(this, void 0, void 0, function* () {
        if (pvActionsMore.querySelector(`#${name}`) || !cur.pvCurPhoto.id.startsWith('-')) {
            return;
        }
        const pvMoreActDownload = yield (0, querySelectorWithTimeout_1.querySelectorWithTimeout)({
            selectors: '#pv_more_act_download',
            element: pvBox,
            timeout: 1000,
            signal,
        }).catch(() => undefined);
        if (!pvMoreActDownload) {
            return;
        }
        if (pvActionsMore.querySelector(`#${name}`)) {
            return;
        }
        signal.throwIfAborted();
        const pvMoreAct = pvMoreActDownload.cloneNode();
        pvMoreAct.id = name;
        pvMoreAct.textContent = textContent;
        pvMoreAct.href = href;
        pvMoreAct.classList.add('pv_more_act_vkfix');
        pvMoreActDownload.parentElement.append(pvMoreAct);
        const pvMoreActsTt = pvBox.querySelector('#pv_more_acts_tt');
        if (pvMoreActsTt) {
            pvMoreActsTt.style.top = `${parseInt(pvMoreActsTt.style.top, 10) - 32}px`;
        }
    });
    const registerMoreActs = () => __awaiter(this, void 0, void 0, function* () {
        if (pvPhotoMoreActCommunityKeeper) {
            yield registerMoreAct('pvPhotoMoreActCommunityKeeper', 'Открыть в Хранителе Групп', `https://vk.com/app51658481#/photo${cur.pvCurPhoto.id}`);
        }
        if (pvPhotoMoreActAlbum && !window.location.href.includes('vk.com/photo-')) {
            yield registerMoreAct('pvPhotoMoreActAlbum', 'Открыть в альбоме', `https://vk.com/photo${cur.pvCurPhoto.id}`);
        }
    });
    pvActionsMore.addEventListener('mouseenter', registerMoreActs, {
        capture: true,
        signal,
    });
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isLog = exports.isDev = void 0;
const GlobalConfig_1 = __webpack_require__(1);
exports.isDev = "production" === 'development';
exports.isLog = GlobalConfig_1.GlobalConfig.Config.get('logging');


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileActions = void 0;
const uiHelpers_1 = __webpack_require__(19);
const Logger_1 = __webpack_require__(0);
const LocationState_1 = __webpack_require__(3);
const GlobalConfig_1 = __webpack_require__(1);
const querySelectorWithTimeout_1 = __webpack_require__(2);
const ApiInteractor_1 = __webpack_require__(8);
function getCurrentProfileId(profile_redesigned) {
    return __awaiter(this, void 0, void 0, function* () {
        let cp = LocationState_1.LocationState.currentPath;
        if (cp.startsWith("/id")) {
            return cp.slice(3);
        }
        const screen_name = cp.slice(1);
        const result = yield ApiInteractor_1.APIInteractor.callApi({
            method: "utils.resolveScreenName",
            data: {
                screen_name,
            },
        });
        return result.response.object_id;
        // раскомментировать, если потребуется больше не использовать APIInteractor
        // const linkSel = profile_redesigned.querySelector("a[href^='/im?sel=']") as HTMLLinkElement | undefined;
        // if (linkSel) {
        //     return linkSel.href.split("/im?sel=")[1];
        // }
        //
        // const linkAudios = profile_redesigned.querySelector("a[href^='/audios']") as HTMLLinkElement | undefined;
        // if (linkAudios) {
        //     return linkAudios.href.split("/audios")[1];
        // }
        //
        // const linkAlbums = profile_redesigned.querySelector("a[href^='/albums']") as HTMLLinkElement | undefined;
        // if (linkAlbums) {
        //     return linkAlbums.href.split("/albums")[1];
        // }
    });
}
const newsBtnId = "vkfix-newsBtn";
function profileActions() {
    return __awaiter(this, void 0, void 0, function* () {
        const isNewsBtn = GlobalConfig_1.GlobalConfig.Config.get('newsBtn');
        if (!isNewsBtn || document.getElementById(newsBtnId)) {
            return;
        }
        const profile_redesigned = yield (0, querySelectorWithTimeout_1.querySelectorWithTimeout)({
            selectors: `#profile_redesigned`
        });
        if (!profile_redesigned) {
            return;
        }
        const ProfileHeader__actions = yield (0, querySelectorWithTimeout_1.querySelectorWithTimeout)({
            element: profile_redesigned,
            selectors: `.ProfileHeader__actions`,
        });
        if (!ProfileHeader__actions) {
            Logger_1.Logger.warn('not found ProfileHeader__actions');
            return;
        }
        const ProfileHeaderActions__buttons = yield (0, querySelectorWithTimeout_1.querySelectorWithTimeout)({
            element: ProfileHeader__actions,
            selectors: ".ProfileHeaderActions__buttons"
        });
        if (!ProfileHeaderActions__buttons) {
            Logger_1.Logger.warn('not found ProfileHeaderActions__buttons');
            return;
        }
        const userId = yield getCurrentProfileId(profile_redesigned);
        const newsBtn = (0, uiHelpers_1.createVkUiButton)('Новости', () => {
            window.open(`/feed?section=source&source=${userId}`);
        });
        newsBtn.id = newsBtnId;
        newsBtn.style.marginLeft = '6px';
        ProfileHeaderActions__buttons.appendChild(newsBtn);
    });
}
exports.profileActions = profileActions;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIInteractor = void 0;
const Logger_1 = __webpack_require__(0);
class APIInteractor {
    static callApiRaw(endpoint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.Logger.log('Call API Raw', data, endpoint);
            const response = yield fetch(endpoint, {
                method: 'POST',
                body: data,
                credentials: "same-origin"
            });
            return yield response.json();
        });
    }
    static callApi(cParams) {
        // Пример доступа к window страницы
        const pageWindow = unsafeWindow;
        const endpoint = `https://api.vk.com/method/${cParams.method}?v=5.251&client_id=6287487`;
        const token = JSON.parse(pageWindow.localStorage.getItem('6287487:web_token:login:auth')).access_token;
        const form = new FormData();
        form.set('access_token', token);
        if (cParams.data) {
            const keys = Object.keys(cParams.data);
            for (const key of keys) {
                form.set(key, cParams.data[key]);
            }
        }
        return APIInteractor.callApiRaw(endpoint, form);
    }
}
exports.APIInteractor = APIInteractor;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appActions = void 0;
const Logger_1 = __webpack_require__(0);
const GlobalConfig_1 = __webpack_require__(1);
const querySelectorWithTimeout_1 = __webpack_require__(2);
const ApiInteractor_1 = __webpack_require__(8);
const saveTemplateAsFile_1 = __webpack_require__(20);
const exportCommunityKeeperBtn = 'exportCommunityKeeperBtn';
function appActions() {
    return __awaiter(this, void 0, void 0, function* () {
        const isNewsBtn = GlobalConfig_1.GlobalConfig.Config.get('exportCommunityKeeperBtn');
        if (!isNewsBtn || !window.location.href.includes('vk.com/app51658481') || document.getElementById(exportCommunityKeeperBtn)) {
            return;
        }
        const grCodeBtn = yield (0, querySelectorWithTimeout_1.querySelectorWithTimeout)({
            selectors: "#qr_code_btn"
        });
        if (!grCodeBtn) {
            Logger_1.Logger.warn('not found #qr_code_btn');
            return;
        }
        const btn = document.createElement('button');
        btn.textContent = 'Создать бэкап из всех сообществ';
        btn.style.setProperty('color', 'var(--vkui--color_text_link)');
        btn.style.setProperty('background-color', 'transparent');
        btn.style.setProperty('border', 'none');
        btn.style.setProperty('cursor', 'pointer');
        btn.style.setProperty('margin-right', '10px');
        btn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const ids = [];
            while (true) {
                const list = yield ApiInteractor_1.APIInteractor.callApi({
                    'method': 'groups.get',
                    data: {
                        count: '1000',
                        offset: `${ids.length}`
                    }
                });
                if (list.response.items.length === 0) {
                    break;
                }
                ids.push(...list.response.items);
            }
            const name = unsafeWindow.prompt('Введите название папки', 'Сообщества');
            const groupIdsDictByFolderName = {
                [name]: ids
            };
            const backup = {
                groupIdsDictByFolderName,
            };
            (0, saveTemplateAsFile_1.saveTemplateAsFile)('backup.json', backup);
        }));
        btn.id = exportCommunityKeeperBtn;
        btn.style.marginLeft = '6px';
        grCodeBtn.parentElement.prepend(btn);
    });
}
exports.appActions = appActions;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messenger = void 0;
const Logger_1 = __webpack_require__(0);
const GlobalConfig_1 = __webpack_require__(1);
const querySelectorWithTimeout_1 = __webpack_require__(2);
function messenger() {
    return __awaiter(this, void 0, void 0, function* () {
        const isPhotoStickers = GlobalConfig_1.GlobalConfig.Config.get('messenger.photo-stickers');
        if (!isPhotoStickers) {
            return;
        }
        // const reforgedRootEl = await querySelectorWithTimeout({selectors: '#reforged-root'});
        const reforgedRootEl = document.getElementById('reforged-root');
        if (!reforgedRootEl) {
            Logger_1.Logger.info('messenger: not found #reforged-root');
            return;
        }
        const popupStickerEl = yield (0, querySelectorWithTimeout_1.querySelectorWithTimeout)({
            selectors: `#popup-sticker-convo-main-history-container`
        });
        if (!popupStickerEl) {
            Logger_1.Logger.info('messenger: not found #popup-sticker-convo-main-history-container');
            return;
        }
        Logger_1.Logger.info('messenger sucess!', popupStickerEl);
    });
}
exports.messenger = messenger;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ==UserScript==
// @name VK Fix
// @description Скрипт для улучшения интерфейса ВКонтакте
// @author Ivan Petrov (LazyTechwork)
// @contributors Ivan Mel (xeleoss)
// @license MIT
// @version 1.1.6
// @include https://vk.com/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant unsafeWindow
// ==/UserScript==
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const styles_1 = __webpack_require__(12);
const mutationHandler_1 = __webpack_require__(16);
const GlobalConfig_1 = __webpack_require__(1);
const LocationState_1 = __webpack_require__(3);
const pageScanner_1 = __webpack_require__(4);
const pvAddons_1 = __webpack_require__(5);
const Logger_1 = __webpack_require__(0);
const profileActions_1 = __webpack_require__(7);
const querySelectorWithTimeout_1 = __webpack_require__(2);
const appActions_1 = __webpack_require__(9);
const messenger_1 = __webpack_require__(10);
(function (window) {
    return __awaiter(this, void 0, void 0, function* () {
        let w = window;
        if (w.self != w.top) {
            return;
        }
        // TODO: Сделать свой конфигуратор, основанный на стилях ВКонтакте
        // Инициализируем новый конфиг
        // [4] дополнительная проверка наряду с @include
        if (/https:\/\/vk.com/.test(w.location.href)) {
            Logger_1.Logger.log('VK Fix запущен');
            // Добавляем кнопку настроек в верхнее меню
            const settings_link = yield (0, querySelectorWithTimeout_1.querySelectorWithTimeout)({ selectors: '#top_settings_link', timeout: 5000 });
            if (settings_link === null || settings_link === void 0 ? void 0 : settings_link.parentNode) {
                const vkfixconflink = document.createElement('a');
                vkfixconflink.innerHTML = 'VK Fix';
                vkfixconflink.id = 'top_vkfix_settings_link';
                vkfixconflink.className = 'top_profile_mrow';
                vkfixconflink.setAttribute('href', '#');
                settings_link.parentNode.insertBefore(vkfixconflink, settings_link.nextSibling); // Вставляем после ссылки на
                // настройки
                vkfixconflink.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    GlobalConfig_1.GlobalConfig.Config.open();
                });
            }
            const onLoadWindow = () => {
                (0, styles_1.default)(); // Инъекция стилей
                (0, pageScanner_1.pageScanner)(); // Инициализируем сканер страницы
                (0, mutationHandler_1.mutationHandler)(); // Регистрируем модуль слежения за мутациями
                (0, pvAddons_1.pvAddons)(); // Инициализируем дополнения к просмотрщику фото
                (0, profileActions_1.profileActions)(); // Инициализируем дополнения к профилю пользователя
                (0, appActions_1.appActions)(); // Инициализируем дополнения к приложениям
                (0, messenger_1.messenger)(); // Инициализируем дополнения к мессенджеру
                window.removeEventListener("load", onLoadWindow);
                // Слежение за изменениями в URL
                LocationState_1.LocationState.init();
            };
            window.addEventListener("load", onLoadWindow);
        }
    });
})(window);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GlobalConfig_1 = __webpack_require__(1);
const fixImagesZooming_1 = __webpack_require__(14);
const fixLeftMenuOverflow_1 = __webpack_require__(15);
function default_1() {
    let style = document.createElement('style');
    style.innerHTML = `
    .im-mess 
    .vkfix-action{
        display: inline-block;
        vertical-align: top;
        width: 24px;
        height: 24px;
        visibility: hidden;
        outline: 0;
        user-select: none;
    }
    .im-mess:hover .vkfix-action{
        visibility: visible;
    }`;
    const fixImagesZoomingEnabled = GlobalConfig_1.GlobalConfig.Config.get('fixImagesZooming');
    if (fixImagesZoomingEnabled) {
        style.innerHTML += fixImagesZooming_1.fixImagesZoomingCss;
    }
    const fixLeftMenuOverflowEnabled = GlobalConfig_1.GlobalConfig.Config.get('fixLeftMenuOverflow');
    if (fixLeftMenuOverflowEnabled) {
        style.innerHTML += fixLeftMenuOverflow_1.fixLeftMenuOverflow;
    }
    document.head.appendChild(style);
}
exports.default = default_1;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*
Copyright 2009+, GM_config Contributors (https://github.com/sizzlemctwizzle/GM_config)

GM_config Contributors:
    Mike Medley <medleymind@gmail.com>
    Joe Simmons
    Izzy Soft
    Marti Martz

GM_config is distributed under the terms of the GNU Lesser General Public License.

    GM_config is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// The GM_config constructor
function GM_configStruct() {
    // call init() if settings were passed to constructor
    if (arguments.length) {
        GM_configInit(this, arguments);
        this.onInit();
    }
}

// This is the initializer function
function GM_configInit(config, args) {
    // Initialize instance variables
    if (typeof config.fields == "undefined") {
        config.fields = {};
        config.onInit = config.onInit || function() {};
        config.onOpen = config.onOpen || function() {};
        config.onSave = config.onSave || function() {};
        config.onClose = config.onClose || function() {};
        config.onReset = config.onReset || function() {};
        config.isOpen = false;
        config.title = 'User Script Settings';
        config.css = {
            basic: [
                "#GM_config * { font-family: arial,tahoma,myriad pro,sans-serif; }",
                "#GM_config { background: #FFF; }",
                "#GM_config input[type='radio'] { margin-right: 8px; }",
                "#GM_config .indent40 { margin-left: 40%; }",
                "#GM_config .field_label { font-size: 12px; font-weight: bold; margin-right: 6px; }",
                "#GM_config .radio_label { font-size: 12px; }",
                "#GM_config .block { display: block; }",
                "#GM_config .saveclose_buttons { margin: 16px 10px 10px; padding: 2px 12px; }",
                "#GM_config .reset, #GM_config .reset a," +
                " #GM_config_buttons_holder { color: #000; text-align: right; }",
                "#GM_config .config_header { font-size: 20pt; margin: 0; }",
                "#GM_config .config_desc, #GM_config .section_desc, #GM_config .reset { font-size: 9pt; }",
                "#GM_config .center { text-align: center; }",
                "#GM_config .section_header_holder { margin-top: 8px; }",
                "#GM_config .config_var { margin: 0 0 4px; }",
                "#GM_config .section_header { background: #414141; border: 1px solid #000; color: #FFF;",
                " font-size: 13pt; margin: 0; }",
                "#GM_config .section_desc { background: #EFEFEF; border: 1px solid #CCC; color: #575757;" +
                " font-size: 9pt; margin: 0 0 6px; }"
            ].join('\n') + '\n',
            basicPrefix: "GM_config",
            stylish: ""
        };
    }

    if (args.length == 1 &&
        typeof args[0].id == "string" &&
        typeof args[0].appendChild != "function") var settings = args[0];
    else {
        // Provide backwards-compatibility with argument style intialization
        var settings = {};

        // loop through GM_config.init() arguments
        for (var i = 0, l = args.length, arg; i < l; ++i) {
            arg = args[i];

            // An element to use as the config window
            if (typeof arg.appendChild == "function") {
                settings.frame = arg;
                continue;
            }

            switch (typeof arg) {
                case 'object':
                    for (var j in arg) { // could be a callback functions or settings object
                        if (typeof arg[j] != "function") { // we are in the settings object
                            settings.fields = arg; // store settings object
                            break; // leave the loop
                        } // otherwise it must be a callback function
                        if (!settings.events) settings.events = {};
                        settings.events[j] = arg[j];
                    }
                    break;
                case 'function': // passing a bare function is set to open callback
                    settings.events = {onOpen: arg};
                    break;
                case 'string': // could be custom CSS or the title string
                    if (/\w+\s*\{\s*\w+\s*:\s*\w+[\s|\S]*\}/.test(arg))
                        settings.css = arg;
                    else
                        settings.title = arg;
                    break;
            }
        }
    }

    /* Initialize everything using the new settings object */
    // Set the id
    if (settings.id) config.id = settings.id;
    else if (typeof config.id == "undefined") config.id = 'GM_config';

    // Set the title
    if (settings.title) config.title = settings.title;

    // Set the custom css
    if (settings.css) config.css.stylish = settings.css;

    // Set the frame
    if (settings.frame) config.frame = settings.frame;

    // Set the event callbacks
    if (settings.events) {
        var events = settings.events;
        for (var e in events)
            config["on" + e.charAt(0).toUpperCase() + e.slice(1)] = events[e];
    }

    // Create the fields
    if (settings.fields) {
        var stored = config.read(), // read the stored settings
            fields = settings.fields,
            customTypes = settings.types || {},
            configId = config.id;

        for (var id in fields) {
            var field = fields[id];

            // for each field definition create a field object
            if (field)
                config.fields[id] = new GM_configField(field, stored[id], id,
                    customTypes[field.type], configId);
            else if (config.fields[id]) delete config.fields[id];
        }
    }

    // If the id has changed we must modify the default style
    if (config.id != config.css.basicPrefix) {
        config.css.basic = config.css.basic.replace(
            new RegExp('#' + config.css.basicPrefix, 'gm'), '#' + config.id);
        config.css.basicPrefix = config.id;
    }
}

GM_configStruct.prototype = {
    // Support old method of initalizing
    init: function() {
        GM_configInit(this, arguments);
        this.onInit();
    },

    // call GM_config.open() from your script to open the menu
    open: function () {
        // Die if the menu is already open on this page
        // You can have multiple instances but you can't open the same instance twice
        var match = document.getElementById(this.id);
        if (match && (match.tagName == "IFRAME" || match.childNodes.length > 0)) return;

        // Sometimes "this" gets overwritten so create an alias
        var config = this;

        // Function to build the mighty config window :)
        function buildConfigWin (body, head) {
            var create = config.create,
                fields = config.fields,
                configId = config.id,
                bodyWrapper = create('div', {id: configId + '_wrapper'});

            // Append the style which is our default style plus the user style
            head.appendChild(
                create('style', {
                    type: 'text/css',
                    textContent: config.css.basic + config.css.stylish
                }));

            // Add header and title
            bodyWrapper.appendChild(create('div', {
                id: configId + '_header',
                className: 'config_header block center'
            }, config.title));

            // Append elements
            var section = bodyWrapper,
                secNum = 0; // Section count

            // loop through fields
            for (var id in fields) {
                var field = fields[id],
                    settings = field.settings;

                if (settings.section) { // the start of a new section
                    section = bodyWrapper.appendChild(create('div', {
                        className: 'section_header_holder',
                        id: configId + '_section_' + secNum
                    }));

                    if (Object.prototype.toString.call(settings.section) !== '[object Array]')
                        settings.section = [settings.section];

                    if (settings.section[0])
                        section.appendChild(create('div', {
                            className: 'section_header center',
                            id: configId + '_section_header_' + secNum
                        }, settings.section[0]));

                    if (settings.section[1])
                        section.appendChild(create('p', {
                            className: 'section_desc center',
                            id: configId + '_section_desc_' + secNum
                        }, settings.section[1]));
                    ++secNum;
                }

                // Create field elements and append to current section
                section.appendChild((field.wrapper = field.toNode()));
            }

            // Add save and close buttons
            bodyWrapper.appendChild(create('div',
                {id: configId + '_buttons_holder'},

                create('button', {
                    id: configId + '_saveBtn',
                    textContent: 'Save',
                    title: 'Save settings',
                    className: 'saveclose_buttons',
                    onclick: function () { config.save() }
                }),

                create('button', {
                    id: configId + '_closeBtn',
                    textContent: 'Close',
                    title: 'Close window',
                    className: 'saveclose_buttons',
                    onclick: function () { config.close() }
                }),

                create('div',
                    {className: 'reset_holder block'},

                    // Reset link
                    create('a', {
                        id: configId + '_resetLink',
                        textContent: 'Reset to defaults',
                        href: '#',
                        title: 'Reset fields to default values',
                        className: 'reset',
                        onclick: function(e) { e.preventDefault(); config.reset() }
                    })
                )));

            body.appendChild(bodyWrapper); // Paint everything to window at once
            config.center(); // Show and center iframe
            window.addEventListener('resize', config.center, false); // Center frame on resize

            // Call the open() callback function
            config.onOpen(config.frame.contentDocument || config.frame.ownerDocument,
                config.frame.contentWindow || window,
                config.frame);

            // Close frame on window close
            window.addEventListener('beforeunload', function () {
                config.close();
            }, false);

            // Now that everything is loaded, make it visible
            config.frame.style.display = "block";
            config.isOpen = true;
        }

        // Change this in the onOpen callback using this.frame.setAttribute('style', '')
        var defaultStyle = 'bottom: auto; border: 1px solid #000; display: none; height: 75%;'
            + ' left: 0; margin: 0; max-height: 95%; max-width: 95%; opacity: 0;'
            + ' overflow: auto; padding: 0; position: fixed; right: auto; top: 0;'
            + ' width: 75%; z-index: 9999;';

        // Either use the element passed to init() or create an iframe
        if (this.frame) {
            this.frame.id = this.id; // Allows for prefixing styles with the config id
            this.frame.setAttribute('style', defaultStyle);
            buildConfigWin(this.frame, this.frame.ownerDocument.getElementsByTagName('head')[0]);
        } else {
            // Create frame
            document.body.appendChild((this.frame = this.create('iframe', {
                id: this.id,
                style: defaultStyle
            })));

            // In WebKit src can't be set until it is added to the page
            this.frame.src = 'about:blank';
            // we wait for the iframe to load before we can modify it
            this.frame.addEventListener('load', function(e) {
                var frame = config.frame;
                var body = frame.contentDocument.getElementsByTagName('body')[0];
                body.id = config.id; // Allows for prefixing styles with the config id
                buildConfigWin(body, frame.contentDocument.getElementsByTagName('head')[0]);
            }, false);
        }
    },

    save: function () {
        var forgotten = this.write();
        this.onSave(forgotten); // Call the save() callback function
    },

    close: function() {
        // If frame is an iframe then remove it
        if (this.frame.contentDocument) {
            this.remove(this.frame);
            this.frame = null;
        } else { // else wipe its content
            this.frame.innerHTML = "";
            this.frame.style.display = "none";
        }

        // Null out all the fields so we don't leak memory
        var fields = this.fields;
        for (var id in fields) {
            var field = fields[id];
            field.wrapper = null;
            field.node = null;
        }

        this.onClose(); //  Call the close() callback function
        this.isOpen = false;
    },

    set: function (name, val) {
        this.fields[name].value = val;

        if (this.fields[name].node) {
            this.fields[name].reload();
        }
    },

    get: function (name, getLive) {
        var field = this.fields[name],
            fieldVal = null;

        if (getLive && field.node) {
            fieldVal = field.toValue();
        }

        return fieldVal != null ? fieldVal : field.value;
    },

    write: function (store, obj) {
        if (!obj) {
            var values = {},
                forgotten = {},
                fields = this.fields;

            for (var id in fields) {
                var field = fields[id];
                var value = field.toValue();

                if (field.save) {
                    if (value != null) {
                        values[id] = value;
                        field.value = value;
                    } else
                        values[id] = field.value;
                } else
                    forgotten[id] = value;
            }
        }
        try {
            this.setValue(store || this.id, this.stringify(obj || values));
        } catch(e) {
            this.log("GM_config failed to save settings!");
        }

        return forgotten;
    },

    read: function (store) {
        try {
            var rval = this.parser(this.getValue(store || this.id, '{}'));
        } catch(e) {
            this.log("GM_config failed to read saved settings!");
            var rval = {};
        }
        return rval;
    },

    reset: function () {
        var fields = this.fields;

        // Reset all the fields
        for (var id in fields) fields[id].reset();

        this.onReset(); // Call the reset() callback function
    },

    create: function () {
        switch(arguments.length) {
            case 1:
                var A = document.createTextNode(arguments[0]);
                break;
            default:
                var A = document.createElement(arguments[0]),
                    B = arguments[1];
                for (var b in B) {
                    if (b.indexOf("on") == 0)
                        A.addEventListener(b.substring(2), B[b], false);
                    else if (",style,accesskey,id,name,src,href,which,for".indexOf("," +
                        b.toLowerCase()) != -1)
                        A.setAttribute(b, B[b]);
                    else
                        A[b] = B[b];
                }
                if (typeof arguments[2] == "string")
                    A.innerHTML = arguments[2];
                else
                    for (var i = 2, len = arguments.length; i < len; ++i)
                        A.appendChild(arguments[i]);
        }
        return A;
    },

    center: function () {
        var node = this.frame;
        if (!node) return;
        var style = node.style,
            beforeOpacity = style.opacity;
        if (style.display == 'none') style.opacity = '0';
        style.display = '';
        style.top = Math.floor((window.innerHeight / 2) - (node.offsetHeight / 2)) + 'px';
        style.left = Math.floor((window.innerWidth / 2) - (node.offsetWidth / 2)) + 'px';
        style.opacity = '1';
    },

    remove: function (el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }
};

// Define a bunch of API stuff
(function() {
    var isGM = typeof GM_getValue != 'undefined' &&
        typeof GM_getValue('a', 'b') != 'undefined',
        setValue, getValue, stringify, parser;

    // Define value storing and reading API
    if (!isGM) {
        setValue = function (name, value) {
            return localStorage.setItem(name, value);
        };
        getValue = function(name, def){
            var s = localStorage.getItem(name);
            return s == null ? def : s
        };

        // We only support JSON parser outside GM
        stringify = JSON.stringify;
        parser = JSON.parse;
    } else {
        setValue = GM_setValue;
        getValue = GM_getValue;
        stringify = typeof JSON == "undefined" ?
            function(obj) {
                return obj.toSource();
            } : JSON.stringify;
        parser = typeof JSON == "undefined" ?
            function(jsonData) {
                return (new Function('return ' + jsonData + ';'))();
            } : JSON.parse;
    }

    GM_configStruct.prototype.isGM = isGM;
    GM_configStruct.prototype.setValue = setValue;
    GM_configStruct.prototype.getValue = getValue;
    GM_configStruct.prototype.stringify = stringify;
    GM_configStruct.prototype.parser = parser;
    GM_configStruct.prototype.log =  window.console ?
        console.log : (isGM && typeof GM_log != 'undefined' ?
            GM_log : (window.opera ?
                    opera.postError : function(){ /* no logging */ }
            ));
})();

function GM_configDefaultValue(type, options) {
    var value;

    if (type.indexOf('unsigned ') == 0)
        type = type.substring(9);

    switch (type) {
        case 'radio': case 'select':
            value = options[0];
            break;
        case 'checkbox':
            value = false;
            break;
        case 'int': case 'integer':
        case 'float': case 'number':
            value = 0;
            break;
        default:
            value = '';
    }

    return value;
}

function GM_configField(settings, stored, id, customType, configId) {
    // Store the field's settings
    this.settings = settings;
    this.id = id;
    this.configId = configId;
    this.node = null;
    this.wrapper = null;
    this.save = typeof settings.save == "undefined" ? true : settings.save;

    // Buttons are static and don't have a stored value
    if (settings.type == "button") this.save = false;

    // if a default value wasn't passed through init() then
    //   if the type is custom use its default value
    //   else use default value for type
    // else use the default value passed through init()
    this['default'] = typeof settings['default'] == "undefined" ?
        customType ?
            customType['default']
            : GM_configDefaultValue(settings.type, settings.options)
        : settings['default'];

    // Store the field's value
    this.value = typeof stored == "undefined" ? this['default'] : stored;

    // Setup methods for a custom type
    if (customType) {
        this.toNode = customType.toNode;
        this.toValue = customType.toValue;
        this.reset = customType.reset;
    }
}

GM_configField.prototype = {
    create: GM_configStruct.prototype.create,

    toNode: function() {
        var field = this.settings,
            value = this.value,
            options = field.options,
            type = field.type,
            id = this.id,
            configId = this.configId,
            labelPos = field.labelPos,
            create = this.create;

        function addLabel(pos, labelEl, parentNode, beforeEl) {
            if (!beforeEl) beforeEl = parentNode.firstChild;
            switch (pos) {
                case 'right': case 'below':
                    if (pos == 'below')
                        parentNode.appendChild(create('br', {}));
                    parentNode.appendChild(labelEl);
                    break;
                default:
                    if (pos == 'above')
                        parentNode.insertBefore(create('br', {}), beforeEl);
                    parentNode.insertBefore(labelEl, beforeEl);
            }
        }

        var retNode = create('div', { className: 'config_var',
                id: configId + '_' + id + '_var',
                title: field.title || '' }),
            firstProp;

        // Retrieve the first prop
        for (var i in field) { firstProp = i; break; }

        var label = field.label && type != "button" ?
            create('label', {
                id: configId + '_' + id + '_field_label',
                for: configId + '_field_' + id,
                className: 'field_label'
            }, field.label) : null;

        switch (type) {
            case 'textarea':
                retNode.appendChild((this.node = create('textarea', {
                    innerHTML: value,
                    id: configId + '_field_' + id,
                    className: 'block',
                    cols: (field.cols ? field.cols : 20),
                    rows: (field.rows ? field.rows : 2)
                })));
                break;
            case 'radio':
                var wrap = create('div', {
                    id: configId + '_field_' + id
                });
                this.node = wrap;

                for (var i = 0, len = options.length; i < len; ++i) {
                    var radLabel = create('label', {
                        className: 'radio_label'
                    }, options[i]);

                    var rad = wrap.appendChild(create('input', {
                        value: options[i],
                        type: 'radio',
                        name: id,
                        checked: options[i] == value
                    }));

                    var radLabelPos = labelPos &&
                    (labelPos == 'left' || labelPos == 'right') ?
                        labelPos : firstProp == 'options' ? 'left' : 'right';

                    addLabel(radLabelPos, radLabel, wrap, rad);
                }

                retNode.appendChild(wrap);
                break;
            case 'select':
                var wrap = create('select', {
                    id: configId + '_field_' + id
                });
                this.node = wrap;

                for (var i = 0, len = options.length; i < len; ++i) {
                    var option = options[i];
                    wrap.appendChild(create('option', {
                        value: option,
                        selected: option == value
                    }, option));
                }

                retNode.appendChild(wrap);
                break;
            default: // fields using input elements
                var props = {
                    id: configId + '_field_' + id,
                    type: type,
                    value: type == 'button' ? field.label : value
                };

                switch (type) {
                    case 'checkbox':
                        props.checked = value;
                        break;
                    case 'button':
                        props.size = field.size ? field.size : 25;
                        if (field.script) field.click = field.script;
                        if (field.click) props.onclick = field.click;
                        break;
                    case 'hidden':
                        break;
                    default:
                        // type = text, int, or float
                        props.type = 'text';
                        props.size = field.size ? field.size : 25;
                }

                retNode.appendChild((this.node = create('input', props)));
        }

        if (label) {
            // If the label is passed first, insert it before the field
            // else insert it after
            if (!labelPos)
                labelPos = firstProp == "label" || type == "radio" ?
                    "left" : "right";

            addLabel(labelPos, label, retNode);
        }

        return retNode;
    },

    toValue: function() {
        var node = this.node,
            field = this.settings,
            type = field.type,
            unsigned = false,
            rval = null;

        if (!node) return rval;

        if (type.indexOf('unsigned ') == 0) {
            type = type.substring(9);
            unsigned = true;
        }

        switch (type) {
            case 'checkbox':
                rval = node.checked;
                break;
            case 'select':
                rval = node[node.selectedIndex].value;
                break;
            case 'radio':
                var radios = node.getElementsByTagName('input');
                for (var i = 0, len = radios.length; i < len; ++i)
                    if (radios[i].checked)
                        rval = radios[i].value;
                break;
            case 'button':
                break;
            case 'int': case 'integer':
            case 'float': case 'number':
                var num = Number(node.value);
                var warn = 'Field labeled "' + field.label + '" expects a' +
                    (unsigned ? ' positive ' : 'n ') + 'integer value';

                if (isNaN(num) || (type.substr(0, 3) == 'int' &&
                    Math.ceil(num) != Math.floor(num)) ||
                    (unsigned && num < 0)) {
                    alert(warn + '.');
                    return null;
                }

                if (!this._checkNumberRange(num, warn))
                    return null;
                rval = num;
                break;
            default:
                rval = node.value;
                break;
        }

        return rval; // value read successfully
    },

    reset: function() {
        var node = this.node,
            field = this.settings,
            type = field.type;

        if (!node) return;

        switch (type) {
            case 'checkbox':
                node.checked = this['default'];
                break;
            case 'select':
                for (var i = 0, len = node.options.length; i < len; ++i)
                    if (node.options[i].textContent == this['default'])
                        node.selectedIndex = i;
                break;
            case 'radio':
                var radios = node.getElementsByTagName('input');
                for (var i = 0, len = radios.length; i < len; ++i)
                    if (radios[i].value == this['default'])
                        radios[i].checked = true;
                break;
            case 'button' :
                break;
            default:
                node.value = this['default'];
                break;
        }
    },

    remove: function(el) {
        GM_configStruct.prototype.remove(el || this.wrapper);
        this.wrapper = null;
        this.node = null;
    },

    reload: function() {
        var wrapper = this.wrapper;
        if (wrapper) {
            var fieldParent = wrapper.parentNode;
            fieldParent.insertBefore((this.wrapper = this.toNode()), wrapper);
            this.remove(wrapper);
        }
    },

    _checkNumberRange: function(num, warn) {
        var field = this.settings;
        if (typeof field.min == "number" && num < field.min) {
            alert(warn + ' greater than or equal to ' + field.min + '.');
            return null;
        }

        if (typeof field.max == "number" && num > field.max) {
            alert(warn + ' less than or equal to ' + field.max + '.');
            return null;
        }
        return true;
    }
};

// Create default instance of GM_config
/* harmony default export */ __webpack_exports__["default"] = (GM_configStruct);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fixImagesZoomingCss = void 0;
document.documentElement.style.setProperty("--device-pixel-ratio", `${window.devicePixelRatio}`);
exports.fixImagesZoomingCss = `
#pv_photo {
   display: flex !important;
   align-items: center;
}

#pv_photo img {
  max-width: 100%;
  max-height: 100%;
  margin-top: 0 !important;
  width: auto !important;
  height: auto !important;
  display: flex;
  justify-content: center;
  align-content: center;
}

.pv_img_progress_wrap {
  display: flex;
  align-items: center;
}

#pv_image_progress {
  margin-top: 0 !important;
}

#pv_photo img, img.can_zoom {
  zoom: calc(1 / var(--device-pixel-ratio));
}
`;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fixLeftMenuOverflow = void 0;
exports.fixLeftMenuOverflow = `
#side_bar {
    overflow: hidden;
    max-height: calc(100vh - 20px);
}
`;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationHandler = void 0;
function mutationHandler() {
    // Настраиваем слежение мутаций в DOM
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // TODO обработать мутации, если нужно
        });
    });
    observer.observe(document.body, { childList: true, subtree: true }); // Включаем нашего следящего на body
}
exports.mutationHandler = mutationHandler;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.VKLocation = void 0;
class VKLocation {
    static getQueryParams() {
        return new URLSearchParams(window.location.search);
    }
    static getConversation() {
        const params = this.getQueryParams();
        const selected = params.get('sel');
        if (!selected || !selected.startsWith('c')) {
            return null;
        }
        return parseInt(selected.substr(1));
    }
    static isConversation() {
        const params = this.getQueryParams();
        const selected = params.get('sel');
        if (!selected) {
            return false;
        }
        return selected.startsWith('c');
    }
}
exports.VKLocation = VKLocation;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.locationMutations = void 0;
const LocationState_1 = __webpack_require__(3);
const pageScanner_1 = __webpack_require__(4);
const pvAddons_1 = __webpack_require__(5);
const profileActions_1 = __webpack_require__(7);
const appActions_1 = __webpack_require__(9);
const messenger_1 = __webpack_require__(10);
const Logger_1 = __webpack_require__(0);
function locationMutations() {
    LocationState_1.LocationState.updateState();
    let cq = LocationState_1.LocationState.currentQuery;
    let pq = LocationState_1.LocationState.previousQuery;
    let cp = LocationState_1.LocationState.currentPath;
    let pp = LocationState_1.LocationState.previousPath;
    Logger_1.Logger.info('execute messenger', cp, cq);
    if (cq.get('sel') != pq.get('sel')) {
        (0, pageScanner_1.pageScanner)();
    }
    if (cq.get('z') != pq.get('z') || cp.startsWith('/photo') && cp !== pp) {
        (0, pvAddons_1.pvAddons)();
    }
    if (cp.startsWith('/app')) {
        (0, appActions_1.appActions)();
    }
    if (cp.startsWith('/im/convo/')) {
        Logger_1.Logger.info('execute messenger');
        (0, messenger_1.messenger)();
    }
    (0, profileActions_1.profileActions)();
}
exports.locationMutations = locationMutations;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createVkUiButton = void 0;
function createVkUiButton(innerHTML, click) {
    const ProfileHeaderButton = document.createElement("div");
    ProfileHeaderButton.className = "ProfileHeaderButton";
    const spanIn = document.createElement('span');
    spanIn.className = "vkuiButton__in";
    const spanCaption = document.createElement("span");
    spanCaption.className = "vkuiButton__content vkuiSubhead vkuiSubhead--sizeY-compact vkuiSubhead--w-2";
    spanCaption.innerHTML = innerHTML;
    const btn = document.createElement('a');
    btn.className = "vkuiButton vkuiButton--sz-m vkuiButton--lvl-secondary vkuiButton--clr-accent vkuiButton--aln-center vkuiButton--sizeY-compact vkuiTappable vkuiTappable--sizeX-regular vkuiTappable--hasHover vkuiTappable--hasActive vkuiTappable--mouse";
    spanIn.appendChild(spanCaption);
    btn.appendChild(spanIn);
    ProfileHeaderButton.appendChild(btn);
    ProfileHeaderButton.addEventListener('click', click);
    return ProfileHeaderButton;
}
exports.createVkUiButton = createVkUiButton;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTemplateAsFile = void 0;
function saveTemplateAsFile(filename, dataObjToWrite) {
    const window = unsafeWindow;
    const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
    const link = document.createElement("a");
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    link.dispatchEvent(evt);
    link.remove();
}
exports.saveTemplateAsFile = saveTemplateAsFile;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPath = void 0;
function extractPath(href) {
    try {
        const url = new URL(href);
        return url.pathname + url.search + url.hash;
    }
    catch (_a) {
        // На случай если передан относительный URL или некорректная строка
        const a = document.createElement('a');
        a.href = href;
        return a.pathname + a.search + a.hash;
    }
}
exports.extractPath = extractPath;


/***/ })
/******/ ]);