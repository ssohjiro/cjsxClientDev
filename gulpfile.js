/*jshint devel:true, node:true, undef:true, unused:strict*/
var gulp = require('gulp');
var gulpif = require('gulp-if');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
//var vtransform = require('vinyl-transform');
var reactify = require('reactify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var envify = require('envify');
var rename = require('gulp-rename');

var coffee = require('gulp-coffee');
var cjsx = require('gulp-cjsx');
var coffeelint = require('gulp-coffeelint');

var coffeeReactTransform = require('gulp-coffee-react-transform');


var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');

var staticDirectory = './';
// Source and target JS files for Browserify
var jsMainFile      = staticDirectory + '_js/index.js';
var jsBundleFile    = staticDirectory + 'js/bundle.js';

// Source and target LESS files
var cssMainFile     = staticDirectory + 'css/style.less';
var cssFiles        = staticDirectory + 'css/**/*.less';
var cssDestDir 	    = staticDirectory + 'css';

var cjsxSrcFiles  	= staticDirectory + 'cjsx/**/*.cjsx';
var coffeeSrcFiles  = staticDirectory + '_coffee/**/*.coffee';
var coffeeDestDir	= staticDirectory + '_coffee';

var _jsDir 			= staticDirectory + '_js';

gulp.task('watchLess', function() {
    gulp.watch(cssFiles, ['devBuildLess']);
});

function swallowError (error) {
    //If you want details of the error in the console
    console.error(error.toString());
    this.emit('end');
}

function buildLess( options ) {
	options = options || {};

	return gulp.src( cssMainFile )
		.pipe( less() )
		.on('error', swallowError)
		.pipe( gulpif( options.production, minifyCSS({keepBreaks:true}) ))
		.pipe( gulp.dest( cssDestDir ));
}

gulp.task('compileCoffee', function() {

	gulp.src( cjsxSrcFiles )
	.pipe( cjsx({ bare: true }).on('error', console.error ))
	.pipe( gulp.dest( _jsDir ));
});

gulp.task('devBuildLess', function(){
	return buildLess();
});

gulp.task('prdBuildLess', function() {
	return buildLess({ production: true });
});


gulp.task('devBuildAndWatchJsx', function() {

	process.env.NODE_ENV = 'developement';

	var bundler = browserify( jsMainFile, {
		debug: true,
		fullPaths: true,
		cache: {},
		packageCache: {}
	}); 
	var w = watchify( bundler, watchify.args );

	w.transform( reactify )
	.transform( envify )
	.on('log', console.log )
	.on('update', rebundle );

	function rebundle() {
		
		var stream = w.bundle();
		stream.on('error', console.error );

		stream = stream.pipe( source( jsBundleFile ));
		return stream.pipe( gulp.dest('./'));
	}

	return rebundle();
});

gulp.task('coffeeLint', function() {
	console.log('coffeeLint');
	gulp.src( coffeeSrcFiles )
	.pipe(coffeelint())
	.pipe(coffeelint.reporter());
});

gulp.task('watchCoffee', function() {
	console.log( 'watchstart' );
    gulp.watch( coffeeSrcFiles, ['coffeeLint']);
});

gulp.task('watchCjsx', function() {
    gulp.watch( cjsxSrcFiles, ['cjsxToCoffee']);
});

gulp.task('cjsxToCoffee', function() {

	gulp.src([ cjsxSrcFiles ])
	.pipe(coffeeReactTransform().on('error', console.error ))
	.pipe( rename({ extname: '.coffee' }))
	.pipe( gulp.dest( coffeeDestDir ));
});

gulp.task('prdBuildJsx', function() {

	process.env.NODE_ENV = 'production';

	var bundler = browserify( jsMainFile );
	bundler.transform( reactify );
	bundler.transform( envify );

	var stream = bundler.bundle();
	stream.on('error', console.error );


	stream = stream.pipe( source( jsBundleFile ));
	stream = stream.pipe( buffer() );
	stream = stream.pipe( uglify() );
	return stream.pipe( gulp.dest('./'));
});

gulp.task('prdbuild', ['prdBuildJsx','prdBuildLess']);
gulp.task('watch', ['devBuildLess','devBuildAndWatchJsx','watchLess','watchCoffee','cjsxToCoffee','watchCjsx']);
