# VK Fix
Инструкция: Как запустить эту хрень?

В TamperMonkey создаём новый скрипт, пихаем туда следующий код.

```// ==UserScript==
// @name VK Fix
// @description Скрипт для улучшения интерфейса ВКонтакте
// @author Ivan Petrov (LazyTechwork)
// @license MIT
// @version 1.0.0
// @include https://vk.com/*
// @require file://C:/Work/Development/vkfix/dist/vkfix.user.js
// ==/UserScript==
```

Вместо `C:/Work/Development/vkfix` вставляем свой путь до этого проекта. Далее запускаем `npm run build` и всё готово, при новом билде скрипт будет автоматически браться из файла