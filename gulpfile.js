'use strict';

const gulp     = require('gulp');
const sass     = require('gulp-sass');
const maps     = require('gulp-sourcemaps');
const prefix   = require('gulp-autoprefixer');
const uglify   = require('gulp-uglify');
const rename   = require('gulp-rename');
const browser  = require('browser-sync').create();
const axe      = require('gulp-axe-webdriver');
const nunjucks = require('gulp-nunjucks');


let paths = {
    dev: './src/',
    dest: './dist/',
    tpl: './src/templates/',
    site: './'
};

let test = {
    home: paths.site + '/index.html'
};


/**
 * @section Build
 * Compile Sass files for theme
 */
gulp.task('sass', function () {
    return gulp.src(paths.dev + '/scss/**/*.scss')
        .pipe(maps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('egreetingrror', sass.logError))
        .pipe(prefix({
            browsers: ['last 1 versions']
        }))
        .pipe(maps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dest + '/css'))
        .pipe(browser.stream());
});


/**
 * @section Build
 * Compile JavaScript files for theme
 */
gulp.task('js', function () {
    return gulp.src(paths.dev + '/js/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dest + '/js'))
        .pipe(browser.stream());
});


/**
 * @section Watch
 * Watch Sass and JavaScript files
 */
gulp.task('watch', function () {
    gulp.watch(paths.dev, ['sass', 'js']);
});


/**
 * @section Sync
 * BrowserSync
 */
gulp.task('sync', ['sass', 'js', 'nunjucks'], function() {
    browser.init({
        server: {
           baseDir: "./"
        }
    });

    gulp.watch(paths.dev + '/scss/**/*.scss', ['sass']);
    gulp.watch(paths.dev + '/js/**/*.js', ['js']);
    gulp.watch(paths.tpl + '/**/*.html', ['nunjucks']);
});


/**
 * @section Test
 * aXe
 */
gulp.task('axe', function(done) {
    var options = {
        saveOutputIn: 'axe.json',
        folderOutputReport: 'reports',
        urls: [
            test.home
        ]
    };
    return axe(options, done);
});


/**
 * @section Templating
 * Nunjucks
 */
gulp.task('nunjucks', function() {
    gulp.src(paths.tpl + '/*.html')
        .pipe(nunjucks.compile())
        .pipe(gulp.dest(paths.site))
        .pipe(browser.stream())
});

/**
 * @section defaulkt: sync
 */
gulp.task('default', ['sync']);
