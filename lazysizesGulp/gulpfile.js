var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    scope: 'devDependencies'
});


gulp.task('views', function() {

    return gulp.src('src/index.html')
        .pipe($.lazysizesDataSrcset({
            decodeEntities: false,
            data_src: 'data-src',
            data_srcset: 'data-srcset',
            //suffix: {'1x': '-320x@1x', '2x': '-320x@2x', '3x': '-320x@3x'}
            suffix: {
                '320w': '-320x',
                '640w': '-640x',
                '960w': '-960x'
            }
        }))
        .pipe(gulp.dest('public'));

});

gulp.task('images', () => {
    // Make configuration from existing HTML and CSS files
    var config = $.responsiveConfig([
        'src/**/*.css',
        'public/**/*.html'
    ]);

    return gulp.src('images/*.{png,jpg}')
        // Use configuration
        .pipe($.responsive(config, {
            errorOnEnlargement: false,
            quality: 80,
            withMetadata: false,
            compressionLevel: 7,
        }))
        .pipe(gulp.dest('public/images'));
});
