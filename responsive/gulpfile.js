var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('images', () => {
  // Make configuration from existing HTML and CSS files
  var config = $.responsiveConfig([
    'public/**/*.css',
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

/*
* Supported filename format
*
* -<width> - image-100.png
* -<width>x - image-100x.png
* -<width>x<height> - image-100x200.png
* -x<height> - image-x200.png
* -<width>x<height>@<scale>x - image-100x200@2x.png
* @<scale>x - image@2x.png
*/


gulp.task('screen', () => {
const Pageres = require('pageres');

const pageres = new Pageres({delay: 2})
    //.src('yeoman.io', ['480x320', '1024x768', 'iphone 5s'], {crop: false})
    //.src('todomvc.com', ['1280x1024', '1920x1080'])
    .src('./public/index.html',  ['320x480','480x320', '1024x768', 'iphone 5s'], {crop: false})
    .dest('out')
    .run()
    .then(() => console.log('done'));
  });
