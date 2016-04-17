// Need to map *.js and *App.jsx files inside gulp/config.js
var gulp        = require('gulp'),
//	browserSync = require('browser-sync').create(),
	nodemon     = require('gulp-nodemon'),
	watch       = require('gulp-watch'),
	del         = require('del'),
	watchify    = require('watchify'),
	path        = require('path'),
	glob        = require('glob');

var browserify   = require('browserify'),
	bundleLogger = require('./gulp/util/bundleLogger'),
	handleErrors = require('./gulp/util/handleErrors'),
	vsource      = require('vinyl-source-stream');

var destination = './build',
	source      = './src';

var config = {

	browserify: {
		bundleConfigs: function () {
			var jsx_dirs = [''];

			var jsx_files = jsx_dirs.map(function(dir) { return glob.sync(source + '/app' + dir + '/*.jsx'); });
			var entries = [];
			for (i = 0; i < jsx_files.length; i++) {
				entries[i] = jsx_files[i].map(function(file) { 
					return {
						entries: file,
						basedir: jsx_dirs[i],
						dest: destination + jsx_dirs[i], 
						outputName: path.basename(file, '.jsx') + '.js'
					}
				});
			}
			return [].concat.apply([], entries);
		}(),

		dependencies: [
			'nano',
			'react',
			'react-dom',
			'request',
			'navbar.jsx'
		],

		debug: false
	}
}


gulp.task('default', ['setup-for-dev'], function () {
	console.log("---> Development (using local DB)");
});


//====================================================================
// DEVELOPMENT CONVENIENCE TASKS
//====================================================================
gulp.task('setup-for-dev', ['browser-sync', 'watch-static-files']);

gulp.task('watch-static-files', function() {
	// First time, copies all static file to be in sync
	// Subsequently, only changed files are copied - incremental build
	gulp.src(source + '/www/**')
		.pipe(watch(source + '/www/**'))
		.pipe(gulp.dest(destination));
});

gulp.task('browser-sync', ['nodemon'], function() {

});

gulp.task('nodemon', ['build'], function (cb) {
	var started = false;
	return nodemon({
		script: 'app.js',
		env: { 'NODE_ENV': 'development' }
	}).on('start', function() {
		// to avoid nodemon being started multiple times
		if (!started) {
			started = true;
			cb();
		} 
	}).on('restart', function() {
		// browserSync.reload();
	});
});

//====================================================================
// BUIDLING TASKS
//====================================================================

//Task: build
gulp.task('build', ['jsdeps'], function() {
	return gulp.src(source + "/www/**")
			.pipe(gulp.dest(destination));
});

//Task: jsdeps - build dependencies i.e. common components
gulp.task('jsdeps',['browserify'] ,function() {
	var bundler = browserify({
					// Required watchify args
					cache: {}, packageCache: {}, fullPaths: false,

					paths: ['./node_modules', source + '/app/components/']
				});

	config.browserify.dependencies.map(bundler.require, bundler);

	var bundle = function() {
		bundleLogger.start('dependencies.js');

		return bundler
			.bundle()
			.on('error', handleErrors)
			.pipe(vsource('dependencies.js'))
			.pipe(gulp.dest('./build/deps'))
			.on('end', reportFinished);
	};

	// Wrap with watchify and rebundle on changes
	bundler = watchify(bundler);
	// Rebundle on update
	bundler.on('update', bundle);

	var reportFinished = function() {
		// Log when bundling completes
		bundleLogger.end('dependencies.js');
	};

	return bundle();
});

//Task: browserify - build individual apps
gulp.task('browserify',['clean'], function(callback) {
	var brconfig    = config.browserify;
	var bundleQueue = brconfig.bundleConfigs.length;

	var browserifyThis = function(bundleConfig) {

		var bundler = browserify({
			// Required watchify args
			cache: {}, packageCache: {}, fullPaths: false,
			// Specify the entry point of your app
			entries: bundleConfig.entries,
			// Add file extentions to make optional in your requires
			extensions: brconfig.extensions,

			paths: ['./node_modules', source + '/app/components/'],
			// Enable source maps!
			debug: brconfig.debug
		});

		// Excluding files in the dependencies array
		brconfig.dependencies.map(bundler.external, bundler);

		var bundle = function() {
			// Log when bundling starts
			bundleLogger.start(bundleConfig.outputName);

			return bundler
				.bundle()
				// Report compile errors
				.on('error', handleErrors)
				// Use vinyl-source-stream to make the
				// stream gulp compatible. Specifiy the
				// desired output filename here.
				.pipe(vsource(bundleConfig.outputName))
				// Specify the output destination
				.pipe(gulp.dest(bundleConfig.dest))
				.on('end', reportFinished);
		};

		// Wrap with watchify and rebundle on changes
		bundler = watchify(bundler);
		// Rebundle on update
		bundler.on('update', bundle);

		var reportFinished = function() {
			// Log when bundling completes
			bundleLogger.end(bundleConfig.outputName);

			if(bundleQueue) {
				bundleQueue--;
				if(bundleQueue === 0) {
					// If queue is empty, tell gulp the task is complete.
					// https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
					callback();
				}
			}
		};

		return bundle();
	};

	// Start bundling with Browserify for each bundleConfig specified
	brconfig.bundleConfigs.forEach(browserifyThis);
});

//Task: clean
gulp.task('clean', function() {
	del.sync(['./build/**']);
});




