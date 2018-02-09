const gulp = require('gulp')
const $ = require('gulp-load-plugins')({
    scope: 'devDependencies'
})
const workbox = require('workbox-build')

gulp.task('image-set', function() {
    return gulp.src('src/bg.css')
        .pipe($.imageSetPlus())
        .pipe(gulp.dest('dist'))
})

gulp.task('views', function() {
    return gulp.src('src/index.html')
        .pipe($.lazysizesDataSrcset({
            decodeEntities: true,
            data_src: 'src',
            data_srcset: 'data-srcset',
            /*
            suffix: {
                '1x': '@1x',
                '2x': '@2x',
                '3x': '@3x'
            },
            */
            suffix: {
                '320w': '@1x',
                '640w': '@2x',
                '960w': '@3x',
                '1280w': '@4x'
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
    var config = $.responsiveConfig([
        'dist/**/*.css',
        'dist/**/*.html'
    ])
    return gulp.src('images/*.{png,jpg,webp}')
        .pipe($.responsive(config, {
            errorOnEnlargement: false,
            quality: 80,
            withMetadata: false,
            compressionLevel: 7,
        }))
        .pipe(gulp.dest('dist/images'))
})


gulp.task('service-worker', () => {
  return workbox.generateSW({
    globDirectory: 'dist',
    globPatterns: ['**\/*.{html,js,css,jpg,png,webp,json}'],
    swDest: `dist/sw.js`,
    clientsClaim: true,
    skipWaiting: true
  }).then(() => {
    console.info('Service worker generation completed.');
  }).catch((error) => {
    console.warn('Service worker generation failed: ' + error);
  });
});



var notify = require("gulp-notify");
gulp.task('note', () => {
gulp.src("./src/test.ext")
  .pipe(notify("Hello Gulp!"))
});

/*
const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint'], function () {
    // This will only run if the lint task is successful...
});

var csslint = require('gulp-csslint');

gulp.task('css', function() {
  gulp.src('client/css/*.css')
    .pipe(csslint())
    .pipe(csslint.formatter());
});

var w3cjs = require('gulp-w3cjs');

gulp.task('w3cjs', function () {
	gulp.src('src/*.html')
		.pipe(w3cjs())
		.pipe(w3cjs.reporter());
});
*/
