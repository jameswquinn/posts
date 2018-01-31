'use strict';

var through = require('through2');
var cheerio = require('cheerio');
var objectAssign = require('object-assign');

var reImageSrc = /^((?:(?:http|https):\/\/)?(?:.+))(\.(?:gif|png|jpg|jpeg|webp|svg))$/;

var defaultOptions = {
	decodeEntities: false,
	data_src: 'data-src',
	data_srcset: 'data-srcset',
	suffix: {'1x': '@1x', '2x': '@2x', '3x': '@3x'}
}

var lazyScr = function(options){

	options = objectAssign({}, defaultOptions, options);

	return through.obj(function(file, enc, cb){
		if (file.isNull()){
			cb(null, file);
			return;
		}

		if (file.isStream()){
			cb(new gutil.PluginError('gulp-lazysizes-srcset', 'Streaming not supported'));
			return;
		}

		var content = file.contents.toString();

		var $ = cheerio.load( content, options );

		var imgList = $('img[data-sizes]');

		imgList.each(function(item){
			var _this = $(this);
			var _src = _this.attr(options.data_src);
			var tmpSrc = [];

			var match = _src.match(reImageSrc);

			// not a valid src attribute
			if (match === null){
				return true;
			}

			for( var key in options.suffix ){
				tmpSrc.push( match[1] + options.suffix[key] + match[2] +' '+ key );
			}

			_this.attr(options.data_srcset, tmpSrc.join(', '));

		});
		// console.log($.html());

		file.contents = new Buffer( $.html() );

		cb(null, file);
	});
}


module.exports = lazyScr;
