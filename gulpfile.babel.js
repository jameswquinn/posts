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
import modernizrConfig from './required/modernizr-config.json';
import responsiveOptions from './required/responsive.js';
import faviconOptions from './required/favicon.js';
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
}
const pkg = require('./package.json');
const comment = '/*\n' +
    ' * <%= pkg.name %> <%= pkg.version %>\n' +
    ' * <%= pkg.description %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' * \n' +
    ' * Copyright 2018, <%= pkg.author %>\n' +
    ' * Released under the <%= pkg.license %> license.\n' +
    '*/\n\n';

gulp.task('taskName', () => {
    gulp.src('dist/js/modernizr.min.js')
        .pipe($.banner(comment, {
            pkg: pkg
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('del', () => {
    return del('dist')
})

gulp.task('copy:misc', () => {
    return gulp.src('misc/**/*')
        .pipe(gulp.dest('dist'))
})

gulp.task('styles', () => {
    const production = [
        precss(),
        cssnext({
            browsers: ['last 2 versions'],
            warnForDuplicates: true
        }),
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

    const development = [
        precss(),
        cssnext({
            browsers: ['last 2 versions'],
            warnForDuplicates: true
        }),
    ]

    return gulp.src('src/styles/chota.css')
        .pipe(!!$.util.env.production ? $.postcss(production) : $.util.noop())
        .pipe(!$.util.env.production ? $.postcss(development) : $.util.noop())
        .pipe(gulp.dest('dist/css'))
})

gulp.task('img', () => {
    return gulp.src('src/images/*.{jpg,png}')
        .pipe($.responsive(responsiveOptions))
        .pipe(gulp.dest('dist/assets/images'));
})

gulp.task('svg2png', () => {
    return gulp.src('src/logo/icon.svg')
        .pipe($.rsvg({
            width: 500,
            height: 500
        }))
        .pipe(gulp.dest('src/logo'));
})

gulp.task('svg:copy', () => {
    gulp.src('src/logo/icon.svg')
        .pipe($.rename({
            basename: 'safari-pinned-tab',
        }))
        .pipe(gulp.dest('dist'))
})

gulp.task("favicon", () => {
    return gulp.src("src/logo/icon.png")
        .pipe(!!$.util.env.production ? $.favicons(faviconOptions) : $.util.noop())
        .on("error", $.util.log)
        .pipe(gulp.dest('dist/assets/icons'));
})

gulp.task('modernizr', (done) => {
    modernizr.build(modernizrConfig, (code) => {
        fs.writeFile(`dist/js/modernizr.min.js`, code, done);
    });
})

gulp.task('htmlnano', () => {
    return gulp
        .src('dist/**/*.html')
        .pipe($.htmlnano(htmlnanoOptions))
        .pipe(gulp.dest('dist'));
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
})

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

// Run PageSpeed Insights
gulp.task('pagespeed', cb =>
    // Update the below URL to the public URL of your site
    pagespeed('https://www.apple.com', {
        strategy: 'desktop'
            // By default we use the PageSpeed Insights free (no API key) tier.
            // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
            // key: 'YOUR_API_KEY'
    }, cb)
)

gulp.task('default', () => {
    runSequence(
        'del',
        'copy:misc',
        'styles', // ...then do this
        'img',
        'svg2png',
        'svg:copy',
        'favicon',
        'modernizr',
        'taskName',
        'htmlnano',
        'critical',
    );
})

//.pipe(!!util.env.production ? dosomething(production) : util.noop())
//.pipe(!util.env.production ? dosomething(development) : util.noop())
