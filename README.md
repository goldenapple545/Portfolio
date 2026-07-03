# Egor Portfolio

Статический сайт-портфолио для публикации на GitHub Pages или Netlify.

## Структура

- `index.html` - главная страница.
- `projects.html` - публичная страница проектов.
- `data/projects.json` - единый источник данных проектов.
- `editor.html` - локальный редактор, недоступный через сервер и публикацию.
- `assets/js/main.js` - загрузка публичных проектов из `data/projects.json`.
- `assets/js/editor.js` - локальное редактирование `data/projects.json`.
- `assets/img/` - изображения сайта и проектов.

## Локальный просмотр сайта

```bash
bash ./start-server.sh
```

Скрипт открывает публичную страницу `projects.html`. Сервер читает проекты только из `data/projects.json`.

## Редактирование проектов

Редактор не предназначен для посетителей и не работает через `http://localhost...`.

1. Открой `editor.html` напрямую из папки проекта, как локальный файл.
2. Нажми `Открыть data/projects.json`.
3. Выбери файл `data/projects.json`.
4. Отредактируй проекты и нажми `Сохранить проект`.

После сохранения публичная страница и сервер будут читать те же данные из `data/projects.json`.

Для прямой записи файла нужен браузер с File System Access API, например Chrome или Edge.

## Деплой на GitHub Pages

### Автоматический деплой (рекомендуется)

Проект уже настроен для автоматической публикации на GitHub Pages через GitHub Actions.

1. Создайте репозиторий на GitHub: `https://github.com/USERNAME/REPO_NAME`
2. Добавьте remote и запушьте код:
   ```bash
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
3. В репозитории перейдите в **Settings → Pages**
4. В разделе **Build and deployment** убедитесь:
   - Source: `GitHub Actions`
   - Workflow автоматически запускается при push в `main`
5. Сайт будет доступен по адресу:
   ```
   https://USERNAME.github.io/REPO_NAME/
   ```

### Настройка FormSubmit (контактная форма)

При первой отправке формы вы получите письмо на `egorvikturov@gmail.com` с просьбой подтвердить email. После подтверждения все сообщения будут приходить автоматически.

Если нужно изменить email получателя — обновите `action` в `<form>` в файле `contacts.html`.

### Локальный просмотр

```bash
bash ./start-server.sh
# или
npm run dev
```

Откройте `http://localhost:4173/contacts.html` для тестирования формы.
