const gulp = require('gulp');
const rev = require('gulp-rev-hash');
const prettyUrl = require("gulp-pretty-url");
const urlPrefix = require('gulp-html-url-prefix');
const structure = require('./config/structure');


gulp.task('index',['pages'], () => {
    gulp.src(structure.src.index)
        .pipe(rev({
            assetsDir: 'public'
        }))
        .pipe(prettyUrl())
        .pipe(urlPrefix({
            //prefix: '//cdn.xxx.com'
            prefix: '',
            tags: ['script', 'link']
        }))
        .pipe(gulp.dest(structure.dest.dir));
});

gulp.task('pages', () => {
    gulp.src(structure.src.pages)
        .pipe(rev({
            assetsDir: 'public'
        }))
        .pipe(prettyUrl())
        .pipe(urlPrefix({
            //prefix: '//cdn.xxx.com'
            prefix: '../',
            tags: ['script', 'link']
        }))
        .pipe(gulp.dest(structure.dest.dir));
});
