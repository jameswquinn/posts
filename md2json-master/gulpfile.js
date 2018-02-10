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
const markdownToJson = require('gulp-markdown-to-json')
const combineJson = require("gulp-combine-json")
const prettyData = require('gulp-pretty-data')
const modifyFile = require('gulp-modify-file')
const rename = require('gulp-rename')
const util = require('gulp-util')
const marked = require('marked')


marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    xhtml: false
});

gulp.task('md2json', () => {
        gulp.src('blog/posts/*.md')
        .pipe(rename({extname: ''}))
        .pipe(markdownToJson(marked, 'blog.json', (data, file) => {
            data.path = file.relative;
            return data;
        }))
        .pipe(gulp.dest('_data'))
        .pipe(modifyFile((content, path, file) => {
            const start = '['
            const end = ']'
            return `${start}${content}${end}`
        }))
        .pipe(combineJson("_posts.json"))
        /*
        .pipe(modifyFile((content, path, file) => {
            const start = '{ "posts":'
            const end = '}'
            return `${start}${content}${end}`
        }))
        */
        .pipe(prettyData({
            type: 'prettify'
        }))
        .pipe(gulp.dest('_data'))
});
