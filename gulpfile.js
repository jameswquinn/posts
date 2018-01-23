/**
 *
 * MIT License
 *
 * Copyright (c) 2017
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
'use strict';


const gulp = require('gulp')
const util = require('gulp-util')
const runSequence = require('run-sequence')
const modernizr = require('modernizr')
const fs = require('fs')
const modernizrConfig = require('./modernizr-config.json')

const cssnext = require('postcss-cssnext')
const postcss = require('gulp-postcss')
const precss = require('precss')
const cssnano = require('cssnano')
const uncss = require('postcss-uncss')


gulp.task('copy:misc', () => {
    return gulp.src('misc/**/*')
        .pipe(gulp.dest('dist'))
})

gulp.task('styles', () => {
    const development = [
        precss(),
        cssnext({
            browsers: ['last 2 versions'],
            warnForDuplicates: true
        }),
    ]
    const production = [
        precss(),
        cssnext({
            browsers: ['last 2 versions'],
            warnForDuplicates: true
        }),
        uncss({
            html: ['index.html'],
            ignore: []
        }),
        cssnano({
            autoprefixer: false,
            preset: ['default', {
                discardComments: {
                    removeAll: true
                }
            }]
        })
    ]
    return gulp.src('src/styles/chota.css')
        .pipe(!!util.env.production ? postcss(production) : util.noop())
        .pipe(!util.env.production ? postcss(development) : util.noop())
        .pipe(gulp.dest('dist'))
})

gulp.task('modernizr', (done) => {
    modernizr.build(modernizrConfig, (code) => {
        fs.writeFile(`dist/js/modernizr.min.js`, code, done);
    });
})

gulp.task('default', () => {
    runSequence(
        'copy:misc',
        'styles', // ...then do this
        'modernizr'
    );
});
