var gulp = require('gulp'),
	connect = require('gulp-connect'),
	open = require("gulp-open"),
	browserify = require('browserify'),
	reactify = require('reactify'),
	source = require("vinyl-source-stream"),
	concat = require('gulp-concat'),
	port = process.env.port || 3031;

// browserify and transform JSX
gulp.task('browserify', function() {
	var b = browserify();
	b.transform(reactify);
	b.add('./app/src/js/main.js');
	return b.bundle()
		.pipe(source('main.js'))
		.pipe(gulp.dest('./app/dist/js'));
});

// launch browser in a port
gulp.task('open', function(){
	var options = {
		url: 'http://localhost:' + port,
  	};
	gulp.src('./app/index.html')
	.pipe(open('', options));
});

// live reload server
gulp.task('connect', function() {
	connect.server({
		root: 'app',
		port: port,
		livereload: true
	});
});

// live reload js
gulp.task('js', function () {
	gulp.src('./app/dist/**/*.js')
		.pipe(connect.reload());
});

// live reload html
gulp.task('html', function () {
	gulp.src('./app/*.html')
	.pipe(connect.reload());
});

// watch files for live reload
gulp.task('watch', function() {
	gulp.watch('app/dist/js/*.js', ['js']);
	gulp.watch('app/index.html', ['html']);
	gulp.watch('app/src/js/**/*.js', ['browserify']);
});

gulp.task('default', ['browserify']);

gulp.task('serve', ['browserify', 'connect', 'open', 'watch']);
