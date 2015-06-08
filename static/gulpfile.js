'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('styles', function () {
  return gulp.src([
      'app/less/main.less'
    ])
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('app/css/'))
    .pipe($.size({title: 'styles'}));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('dev', ['styles','jshint']);
gulp.task('serve', ['dev'], function () {
  browserSync({
    notify: false,
    server: 'app'
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/less/**/*.less'], ['styles', reload]);
  gulp.watch(['app/js/**/*.js'], ['jshint']);
  gulp.watch(['app/img/**/*'], reload);
});

// gulp.task('dist', ['html', 'fonts', 'copy']);
// gulp.task('default', ['dev']);
