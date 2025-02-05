# Домашнее задание: Трекер финансов

Задача: разработать простое приложение для учёта личных финансов.

## Стек

- Angular 18
- Less
- NX
- Taiga UI 3.92.0

## Технические требования

- Создать проект при помощи NX;
- Весь проект должен содержаться на одной странице;
- Использовать standalone components;
- Хотя бы раз использовать двустороннее связывание данных (two-way data binding);
- Хотя бы раз применить `@if` и `@for`, не использовать структурные директивы по типу `ngIf`;
- Использовать только реактивные формы;
- Реализовать и внедрить хотя бы один пайп;
- Реализовать и внедрить хотя бы одну директиву;
- Резрешено и крайне рекомендовано создавать вспомогательные сервисы, фасады и пр.

## Обязательные задания

### 1. Форма для добавления транзакций (25 баллов)

Описание: создайте форму, которая позволяет вносить доходы и расходы.

#### Поля формы

##### Вид транзакции

- Реализовать при помощи: [Block](https://taiga-ui.dev/components/block#groups);
- Назначение: выбор типа транзакции - доход или расход.
- Валидация:
    - Обязательно для заполнения;

##### Категория транзакции

- Реализовать при помощи: [Select](https://taiga-ui.dev/components/select);
- Назначение: выбор категории транзакции;
- Валидация:
    - Обязательно для заполнения;
- Доп. требования:
    - Списки для категорий доходов и расходов должны быть разными;
    - Наполнить списки любыми категориями (с учётом пункта выше);

##### Сумма транзакции

- Реализовать при помощи: [InputNumber](https://taiga-ui.dev/components/input-number#currency);
- Назначение: внесение суммы транзакции;
- Валидация:
    - Обязательно для заполнения;
    - Вносимое значение не меньше 0;
    - Вносимое значение не больше 10 000 000;
- Доп. требования:
    - Вводить можно только цифры.

##### Дата транзакции

- Реализовать при помощи: [InputDate](https://taiga-ui.dev/components/input-date);
- Назначение: внесение даты транзакции;
- Валидация:
    - Обязательно для заполнения;
    - Нельзя выбирать даты из будущего (завтра и так далее).

##### Комментарий к транзакции

- Реализовать при помощи: [Input](https://taiga-ui.dev/components/input) или [Textarea](https://taiga-ui.dev/components/textarea);
- Назначение: внесение необязательного комментария для транзакции;
- Валидация:
    - Обязательно для заполнения если выбран чекбокс "Добавить коментарий";
    - Длина не более 100 символов;
- Доп. требования:
    - Реализовать директиву для добавления и очищения валидаторов для поля "Коментарий к транзакции". Если чекбокс "Добавить коментарий" включен - директива должна добавлять валидатор "Обязательно для заполнения" и "Длина не более 100 символов", иначе она должна очищать все валидаторы поля;

#### Отправка формы

- Реализовать посредством клика по кнопке;
- Доп. требования:
    - Клик по кнопке должен проверять валидацию полей формы;
    - Кнопка всегда должна быть активна (не `disabled`);
    - Если форма невалидна, то под всеми полями формы должны выводиться [ошибки](https://taiga-ui.dev/pipes/field-error) с уникальным текстом (придумать самостоятельно). К примеру, если не пройдено требование валидатора `required`, то ошибка должна быть "Заполните это поле", а если не пройдено требование валидатора `min(0)`, то ошибка должна быть "Введите неотрицательное число";
    - Если данные формы валидны - выведите [алерт](https://taiga-ui.dev/components/alert) об успешном сохранении данных.

### 2. Компонент "История транзакций" (25 баллов)

Описание: создайте компонент, который отображает все внесенные через форму транзакции.

#### Требования

- Транзакции должны сортироваться по дате;
- Каждая транзакция должна отображать категорию и сумму;
- При наведении курсора на транзакцию должен отображаться [коментарий](https://taiga-ui.dev/directives/hint) (если он есть);
- Для отображения суммы транзакции напишите кастомный пайп;
    - Пайп должен подставлять знак "+" или "-" в зависимости от типа транзакции;
    - Пайп должен разбивать сумму на разряды пробелом, отделять дробную часть запятой, добавлять символ валюты (₽), например `- 1 000 000,00 ₽`.

### 3. Компонент "Статистика" (10 баллов)

Описание: реализуйте визуальное отображение статистики доходов и расходов.

#### Требования

- С помощью [RingChart](https://taiga-ui.dev/charts/ring-chart#labels) создайте две диаграммы (для доходов, и расходов), обобщающие информацию по категориям;
- При наведении на сектор диаграммы должен отображаться лейбл с суммой и категорией (см. пункт With Labels в документации к RingChart).

## Дополнительные задания

- Реализовать сохранение транзакций в localStorage (5 баллов);
- Добавить анимации при добавлении транзакций (5 баллов);
- Добавить возможность редактирования транзакций (10 баллов).
