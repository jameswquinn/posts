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

import gulp from 'gulp';
import util from 'gulp-util';
import runSequence from 'run-sequence';
import modernizr from 'modernizr';
import fs from 'fs';
import critical from 'critical';
import modernizrConfig from './modernizr-config.json';

import postcss from 'gulp-postcss';
import precss from 'precss';
import cssnext from 'postcss-cssnext';
import uncss from 'postcss-uncss';
import cssnano from 'cssnano';



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

gulp.task('critical', (cb) => {
    critical.generate({
        inline: true,
        base: '.',
        src: 'index.html',
        dest: 'index.html',
        dimensions: [{
            width: 320,
            height: 480
        }, {
            width: 768,
            height: 1024
        }, {
            width: 1280,
            height: 960
        }],
    });
});

gulp.task('default', () => {
    runSequence(
        'copy:misc',
        'styles', // ...then do this
        'modernizr'
    );
});
