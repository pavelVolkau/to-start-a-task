// Declaring Variables
const { src, dest, watch, parallel, series } = require('gulp')

const sass = require('gulp-sass')(require('sass'))
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify-es').default
const autoprefixer = require('gulp-autoprefixer')
const del = require('del')
const imagemin = require('gulp-imagemin') // version 7.1.0, version 8.0.0 is ESM package

// Pure ESM package!!!
/* import imagemin from 'gulp-imagemin' */

// Page refresh function
function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'src',
    },
  })
}

// Converting preprocessors
function styles() {
  return src('src/sass/main.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(concat('main.min.css'))
    .pipe(
      autoprefixer({ overrideBrowserslist: ['last 10 version'], grid: true })
    )
    .pipe(sourcemaps.write())
    .pipe(dest('src/css'))
    .pipe(browserSync.stream())
}

// Converting scripts
function scripts() {
  return src('src/js/main.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write())
    .pipe(dest('src/js'))
    .pipe(browserSync.stream())
}

// Image Compression
function images() {
  return src('src/assets/images/**/*')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest('dist/assets/images'))
}

// Tracking
function watching() {
  watch(['src/sass/**/*.+(sass|scss)'], styles)
  watch(['src/js/**/*.js', '!src/js/**/main.min.js'], scripts)
  watch(['src/*.html']).on('change', browserSync.reload)
}

// Removing the current project ('~/dist')
function cleanDist() {
  return del('dist')
}

// Assembly of the actual project
function build() {
  return src(
    [
      'src/*.html',
      'src/css/main.min.css',
      'src/js/main.min.js',
      'src/assets/**/*',
      '!src/assets/images/**/*',
    ],
    {
      base: 'src',
    }
  ).pipe(dest('dist'))
}

// Commands for gulp
exports.styles = styles
exports.scripts = scripts
exports.browsersync = browsersync
exports.watching = watching
exports.images = images
// remove commands
exports.clean = cleanDist // Remove '~/dist'
// building commands
exports.build = series(cleanDist, build, images) // project rebuild
// default command
exports.default = parallel(browsersync, styles, scripts, watching)
