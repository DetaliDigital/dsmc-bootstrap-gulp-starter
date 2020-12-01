# dsmc-gulp-bootstrap-starter

Практически без первоначальной настройки вы можете разрабатывать с помощью автоматической компиляции HTML и SCSS, использовать локальный сервер BrowserSync с перезагрузкой в ​​реальном времени и постоянно обновлять сторонние библиотеки.

### В состав сборки входит:

```json
"dependencies": {
    "bootstrap": "^4.4.1",
    "bootstrap-icons": "^1.0.0-alpha4"
  },
  "devDependencies": {
    "browser-sync": "^2.26.7",
    "chalk": "^2.4.2",
    "del": "^3.0.0",
    "gulp": "^4.0.1",
    "gulp-autoprefixer": "^7.0.1",
    "gulp-cdnizer": "^2.0.2",
    "gulp-changed": "^3.2.0",
    "gulp-clean-css": "^4.2.0",
    "gulp-npm-dist": "^1.0.0",
    "gulp-rename": "^1.2.2",
    "gulp-sass": "^4.0.2",
    "gulp-sourcemaps": "^2.6.4"
  }
```

### Основные команды 

- `gulp` - таскер скомпилирует исходники в dist, а затем запустит локальный экземпляр Browsersync на порту 3000 для обслуживания и обновления ваших страниц по мере редактирования.
- `gulp build` - таскер очистит папку dist, а затем скомпилирует в нее исходники.
- `get:bootstrap` - таскер cкопирует из `node_modules/bootstrap/scss в папку` `/scss/bootstrap` папку `bootstrap` создаст автоматически. 


