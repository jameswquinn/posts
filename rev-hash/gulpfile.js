const gulp = require('gulp');
const rev = require('gulp-rev-hash');
const prettyUrl = require("gulp-pretty-url");
//const urlPrefix = require('gulp-html-url-prefix');
const urlPrefix = require('gulp-html-url-prefix-custom');
const structure = require('./config/structure');


gulp.task('index',['pages'], () => {
    gulp.src(structure.src.index)
        .pipe(rev({
            assetsDir: 'public'
        }))
        .pipe(prettyUrl())
        .pipe(urlPrefix({
          prefix: '',
          attrdata: ["script:src", "link:href"]  //自定义标签属性
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
          prefix: '../',
          attrdata: ["script:src", "link:href"]  //自定义标签属性
        }))
        .pipe(gulp.dest(structure.dest.dir));
});
