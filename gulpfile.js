var gulp = require('gulp'),
	minify = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint');

gulp.task("minify", function() {
	return gulp.src('./static/css/*.css')
		.pipe(minify())
		.pipe(gulp.dest('./dist/css/'));
});

gulp.task("uglify", function() {
	return gulp.src('./static/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task("jshint",function(){
	return gulp.src('./static/js/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task("default",["minify","jshint","uglify"]);