# VK Fix
VK Fix - скрипт, пришедший на замену VK Opt. Мы исправляем ВКонтакте в лучшую сторону. Мы сделали VK Fix максимально гибким, любой модуль можно включить или выключить.

## Инструкция по запуску в режиме разработки

В TamperMonkey создаём новый скрипт, пихаем туда следующий код.

```js
// ==UserScript==
// @name VK Fix
// @description Скрипт для улучшения интерфейса ВКонтакте
// @author Ivan Petrov (LazyTechwork)
// @license MIT
// @version 1.0.0
// @include https://vk.com/*
// @require file://C:/Work/Development/vkfix/dist/vkfix.user.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// ==/UserScript==
```

Вместо `C:/Work/Development/vkfix` вставляем свой путь до этого проекта. Далее запускаем `npm run build` и всё готово, при новом билде скрипт будет автоматически браться из файла. 

Не забудьте дать TamperMonkey разрешение на работу с локальными файлами, это делается в настройках расширений Chrome.

Для автоматической сборки при изменениях используйте `npm start`