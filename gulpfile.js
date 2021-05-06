'use strict'

const { src, dest } = require('gulp')
const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const removeComments = require('gulp-strip-css-comments')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const cssnano = require('gulp-cssnano')
const plumber = require('gulp-plumber')
const imagemin = require('gulp-imagemin')
const del = require('del')
const browsersync = require('browser-sync').create()

/* Paths */
var path = {
  build: {
    html: 'dist/',
    css: 'dist/css/',
    images: 'dist/images/',
    fonts: 'dist/fonts/',
  },
  src: {
    html: 'src/*.html',
    css: 'src/sass/*.scss',
    images: 'src/images/**/*',
    fonts: 'src/fonts/**/*',
  },
  watch: {
    html: 'src/**/*.html',
    css: 'src/sass/**/*.scss',
    images: 'src/images/**/*.',
    fonts: 'src/fonts/**/*',
  },
  clean: './dist',
}

/* Tasks */
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './dist/',
    },
    port: 3777,
    notify: true,
  })
}

function browserSyncReload(done) {
  browsersync.reload()
}

function html() {
  return src(path.src.html, { base: 'src/' })
    .pipe(plumber())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css() {
  return src(path.src.css, { base: 'src/sass/' })
    .pipe(plumber())
    .pipe(sass())
    .pipe(
      autoprefixer({
        Browserslist: ['last 8 versions'],
        cascade: true,
      }),
    )
    .pipe(dest(path.build.css))
    .pipe(
      cssnano({
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      }),
    )
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: '.min',
        extname: '.css',
      }),
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function images() {
  return src(path.src.images).pipe(imagemin()).pipe(dest(path.build.images))
}

function fonts() {
  return src(path.src.fonts).pipe(dest(path.build.fonts))
}

function clean() {
  return del(path.clean)
}

function watchFiles() {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.images], images)
  gulp.watch([path.watch.fonts], fonts)
}

const build = gulp.series(clean, gulp.parallel(html, css, images, fonts))
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync))

/* Exports Tasks */
exports.html = html
exports.css = css
exports.images = images
exports.fonts = fonts
exports.clean = clean
exports.build = build
exports.watch = watch
exports.default = watch
