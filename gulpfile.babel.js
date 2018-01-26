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
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import modernizr from 'modernizr';
import fs from 'fs';
import del from 'del';
import critical from 'critical';
import modernizrConfig from './src/modernizr-config.json';
import {
    output as pagespeed
}
from 'psi';

import precss from 'precss';
import cssnext from 'postcss-cssnext';
import uncss from 'postcss-uncss';
import cssnano from 'cssnano';
import customProperties from 'postcss-custom-properties';
import Import from 'postcss-import';
import styleGuide from 'postcss-style-guide';

const $ = gulpLoadPlugins();
const htmlnanoOptions = {
    removeComments: true
};

gulp.task('styleguide', () => {
    return gulp.src('dist/chota.css')
        .pipe($.postcss([
            Import(),
            customProperties({
                preserve: true
            }),
            styleGuide({
                project: 'Project name',
                dest: 'dist/styleguide/index.html',
                showCode: true,
                themePath: 'node_modules/psg-theme-default'
            }),
        ]))
})

gulp.task('htmlnano', () => {
    return gulp
        .src('dist/**/*.html')
        .pipe($.htmlnano(htmlnanoOptions))
        .pipe(gulp.dest('dist'));
})

gulp.task('del', () => {
    return del('dist')
})

gulp.task('copy:misc', () => {
    return gulp.src('misc/**/*')
        .pipe(gulp.dest('dist'))
})

gulp.task('styles', () => {
    const postcssOptions = [
        precss(),
        cssnext({
            browsers: ['last 2 versions'],
            warnForDuplicates: true
        }),
    ]
    return gulp.src('src/styles/chota.css')
        .pipe($.postcss(postcssOptions))
        .pipe(gulp.dest('dist'))
})

gulp.task('uncss', () => {
    const uncssOptions = [
        uncss({
            html: ['dist/**/*.html'],
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
    return gulp.src('dist/chota.css')
        .pipe(!!$.util.env.production ? postcss(uncssOptions) : $.util.noop())
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
        base: 'dist',
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
        'del',
        'copy:misc',
        'styles', // ...then do this
        'uncss',
        'styleguide',
        'modernizr',
        'htmlnano',
        'critical',
    );
});

// Run PageSpeed Insights
gulp.task('pagespeed', cb =>
    // Update the below URL to the public URL of your site
    pagespeed('https://www.apple.com', {
        strategy: 'desktop'
            // By default we use the PageSpeed Insights free (no API key) tier.
            // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
            // key: 'YOUR_API_KEY'
    }, cb)
);


//.pipe(!!util.env.production ? dosomething(production) : util.noop())
//.pipe(!util.env.production ? dosomething(development) : util.noop())
