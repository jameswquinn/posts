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
                '1x': '-320x@1x',
                '2x': '-320x@2x',
                '3x': '-320x@3x'
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
