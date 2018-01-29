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


//file:///Users/jamesquinn/responsive/public/images/background-image-x549.jpg
//file:///Users/jamesquinn/responsive/public/images/background-image-x1373.jpg
