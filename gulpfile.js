'use strict';

const gulp = require('gulp');

let changed = require('gulp-changed'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    npmDist = require('gulp-npm-dist'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    bs = require('browser-sync').create(),
    path = require('path'),
    chalk = require('chalk'),
    notify = require('gulp-notify');

const srcLayoutFiles = 'src/*.html'
const srcSassFiles = 'scss/style.default.scss'
const moduleBootstrapSass = 'node_modules/bootstrap/scss/**'
const srcSassBootstrap = 'scss/bootstrap/'

const distAppDir = 'dist/'
const distStyleDir = 'dist/css/'
const distVendorDir = 'dist/vendor/'

const copy = ['js/**', 'img/**', 'fonts/**', 'css/custom.css', 'icons/**', 'docs/**']

const config = {
    autoprefixer: {
        cascade: false
    },
    sass: {
        outputStyle: 'expanded',
        includePaths: ['src/scss']
    }
}

// Очистить папку dist после таска

gulp.task('clean', function () {
    return del([
        distAppDir + '**/*'
    ]);
});

// Скопировать измененные layout HTML

gulp.task('html', function () {
    return gulp.src(srcLayoutFiles)
    // only pass changed files
    .pipe(changed(distAppDir))
    .pipe(gulp.dest(distAppDir))
});

// Cкопировать содержание папки pages в dist

gulp.task('copy', function () {
    return getFoldersSrc('pages', copy)
        .pipe(changed(distAppDir))
        .pipe(gulp.dest(distAppDir));

});

// Cкопировать содержание папки bootstrap

gulp.task('bootstrap', function () {
    return gulp.src(moduleBootstrapSass)
        .pipe(gulp.dest(srcSassBootstrap))
});


// If running in dev mode w/ Browser Sync, there is no watcher set for this, it executes
// only when calling initial `gulp` command or you run `gulp vendor` separately

gulp.task('vendor', function () {
    return gulp.src(npmDist({
        copyUnminified: true
    }), {
        base: './node_modules/'
    })
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace(/\/distribute/, '').replace(/\\distribute/, '').replace(/\/dist/, '').replace(/\\dist/, '');
        }))
        .pipe(gulp.dest(distVendorDir));
});

// Dev SASS Task - no sourcemaps, no autoprefixing, no minification
gulp.task('sass-dev', function () {

    return gulp.src(srcSassFiles)
        .pipe(sass(config.sass).on('error', sass.logError))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(distStyleDir));
});

// Build SASS Task - sourcemaps, minification

gulp.task('sass-build', function () {
    return gulp.src(srcSassFiles)
        .pipe(sourcemaps.init())
        .pipe(sass(config.sass).on('error', sass.logError))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(distStyleDir))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distStyleDir));
});

// Default Gulp Task
// 1. Process HTML, vendor dir, SCSS and copy static assets
// 2. Init Browser Sync
// 3. Watch SCSS files, HTML files and static assets
gulp.task('default', gulp.series(
        gulp.parallel('html', 'vendor', 'sass-dev', 'copy'),
        serve,
        watch
    ));

// Build Gulp Task
// 1. Clean dist folder
// 2. Process HTML, vendor dir, SCSS w/ source maps and minification and copy static assets
gulp.task('build',
    gulp.series(
        'clean',
        gulp.parallel('vendor', 'html', 'sass-build', 'copy')
    ));

gulp.task('get:bootstrap',
    gulp.series(
        'bootstrap'
    ));

// Helper functions

function reload(done) {
    bs.reload();
    done();
}

function serve(done) {
    bs.init({
        server: {
            baseDir: distPageDir
        },
        files: [
            distStyleDir + '*.css'
        ]
    });
    done();
}

function watch(done) {

    gulp.watch("scss/**/*.scss", gulp.series('sass-dev'));
    gulp.watch("pages/*.html", gulp.series('html', reload));
    gulp.watch(getFolders('pages', copy), gulp.series('copy', reload));

    console.log(chalk.yellow('Now watching files for changes...'));

    done();
}

function getFolders(base, folders) {
    return folders.map(function (item) {
        return path.join(base, item);
    });
}

function getFoldersSrc(base, folders) {
    return gulp.src(folders.map(function (item) {
        return path.join(base, item);
    }), {
        base: base,
        allowEmpty: true
    });
}


