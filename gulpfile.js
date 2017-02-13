'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    transpile = require('gulp-babel'),
    uglify = require('gulp-uglify');

const BROWSER_BUILD_DIR = './browser-build',
    ES5_BUILD_DIR = './es5-build';

gulp.task('browser-build', () => gulp.src([
    './lib/browser-setup.js',
    './lib/errors.js',
    './lib/schemas/*-schema.js',
    './lib/create-instance.js',
    './lib/browser.js'
])
    .pipe(concat('all.min.js'))
    .pipe(transpile({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(gulp.dest(BROWSER_BUILD_DIR)));

gulp.task('es5-build', () => gulp
                                .src('./lib/**/*.js')
                                .pipe(transpile({ presets: ['es2015'] }))
                                .pipe(gulp.dest(ES5_BUILD_DIR)));

gulp.task('all', ['browser-build', 'es5-build']);