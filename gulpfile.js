'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    transpile = require('gulp-babel'),
    uglify = require('gulp-uglify');

const BUILD_DIR = './browser-build';

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
    .pipe(gulp.dest(BUILD_DIR)));