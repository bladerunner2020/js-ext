# Модуль js-ext для проектов в iRidium mobile

JS в [iRidium mobile](http://www.iridi.com) построен на основе достаточно старого стандарта **ECMAScript 3**. Данный модуль
добавляет функции, которые появились в новых версиях. Кроме того, в нем определены функции, которые есть в *iRidium*,
но отличаются от стандартного описания (например, вместо *setTimeout* нужно писать *IR.SetTimeout*, что не удобно и
не позволяет создавать многоплатформенный код).

## Установка и настройка

**Добавьте модуль в проект**

Если используется grunt-скрипт [Iridium Project Builder](https://github.com/bladerunner2020/iridium-project-builder)
для автоматического построения проектов, то для установки модуля нужно использовать команду:

```
npm install https://github.com/bladerunner2020/js-ext.git --save
```

В противном случае просто скопируйте код из **index.js** в ваш irpz-проект.

**ЗАМЕЧАНИЕ:** **js-ext** должен быть первым модулем в списке модулей в *iRidium mobile*.


## Добавленные и измененные функции

**Array**
- Array.prototype.indexOf - [Source](http://es5.github.io/#x15.4.4.14)
- Array.prototype.every - [Source](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
- Array.prototype.forEach
- Array.isArray
- Array.prototype.map
- Array.prototype.filter
- Array.prototype.includes

**String**
- String.prototype.trim
- String.prototype.repeat

**Date**
- Date.now
- Date.prototype.toISOString - [Source](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)
- Date.prototype.parse - [Source](https://stackoverflow.com/questions/5802461/javascript-which-browsers-support-parsing-of-iso-8601-date-string-with-date-par)

**JSON**
- JSON.parse - вместо *JSON.Parse* + корректная работа, если в строках есть символы **\r** или **\n**. Это отличается от стандарта JS,
но, в *Node JS* JSON.parse корректно работает с этими символами.
- JSON.stringify - вместо *JSON.Stringify*

**Number**
- Number.isInteger
- Number.isFinite
- Number.isNaN

**Function**
- Function.prototype.bind - [Source](https://github.com/Raynos/function-bind)
- encode

**Object**
- Object.keys - [Source](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
- Object.create
- Object.assign

**Console**
- console.log - вместо IR.Log
- console.error - идентичен console.log

**Таймеры**
- setTimeout - вместо *IR.SetTimeout* (**NOTE**: в *setTimeout* стандартное расположение аргументов для js)
- setInterval - вместо *IR.SetInterval* (**NOTE**: в *setInterval* стандартное расположение аргументов для js)
- clearTimeout - вместо *IR.ClearTimeout*
- clearInterval - вместо *IRClearInterval*

## История изменений
* v1.24.0 - Добавлена функция **Array.prototype.includes** (плюс тесты)
* v1.23.0 - Переработана функция **console.log**, удалена работа с модулями (**require**)
* v1.22.2 - Добавлена функция **Number.isFinite**
* v1.22.1 - Добавлена функция **Number.isNaN**
* v1.22.0 - Добавлена функция **Object.assing**
* v1.20.0 - Добавлена функция **escape**

## Авторы и контрибуторы

* Александр Пивоваров aka Bladerunner2020 ([pivovarov@gmail.com](mailto:pivovarov@gmail.com))
* Анонимный автор из телеграм-группы [Iridium Devs](https://t.me/joinchat/ACv_8w0_68dXUQ0M0pTbPg) (реализация console.log)

## Лицензия
Copyright (c) 2018-2023 Александр Пивоваров

Данная лицензия разрешает лицам, получившим копию данного программного обеспечения и сопутствующей документации (в дальнейшем именуемыми «Программное Обеспечение»), безвозмездно использовать Программное Обеспечение без ограничений, включая неограниченное право на использование, копирование, изменение, слияние, публикацию, распространение, сублицензирование и/или продажу копий Программного Обеспечения, а также лицам, которым предоставляется данное Программное Обеспечение, при соблюдении следующих условий:

Указанное выше уведомление об авторском праве и данные условия должны быть включены во все копии или значимые части данного Программного Обеспечения.

ДАННОЕ ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ, ЯВНО ВЫРАЖЕННЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ ГАРАНТИИ ТОВАРНОЙ ПРИГОДНОСТИ, СООТВЕТСТВИЯ ПО ЕГО КОНКРЕТНОМУ НАЗНАЧЕНИЮ И ОТСУТСТВИЯ НАРУШЕНИЙ, НО НЕ ОГРАНИЧИВАЯСЬ ИМИ. НИ В КАКОМ СЛУЧАЕ АВТОРЫ ИЛИ ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ПО КАКИМ-ЛИБО ИСКАМ, ЗА УЩЕРБ ИЛИ ПО ИНЫМ ТРЕБОВАНИЯМ, В ТОМ ЧИСЛЕ, ПРИ ДЕЙСТВИИ КОНТРАКТА, ДЕЛИКТЕ ИЛИ ИНОЙ СИТУАЦИИ, ВОЗНИКШИМ ИЗ-ЗА ИСПОЛЬЗОВАНИЯ ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ ИЛИ ИНЫХ ДЕЙСТВИЙ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.
