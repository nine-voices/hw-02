// variables
var gulp			= require('gulp'),
	prefix			= require('gulp-autoprefixer'),
	minifyCss		= require('gulp-minify-css'),
	rename			= require('gulp-rename'),
	concatCss		= require('gulp-concat-css'),
	concat			= require('gulp-concat'),
	browserSync		= require('browser-sync'),
	scss			= require('gulp-scss'),
	sass			= require('gulp-sass'),
	jade			= require('gulp-jade');


// jade2html converting
gulp.task('jade', function() {
	var settings = {
		pretty: true
	};
	gulp.src('./_dev/_makeups/_pages/*.jade')
	.pipe(jade(settings))
	.pipe(gulp.dest('./app/html/'))
});

// compiling scss to css
gulp.task("sass", function () {
	gulp.src(["./_dev/_styles/_misc/*.scss", "./_dev/_styles/_sections/*.scss"])
		.pipe(sass())
		.pipe(gulp.dest("./app/css"));
});

// concatting maincss
gulp.task('bundle', function() {
	gulp.src('app/css/*.css')
	.pipe(concatCss('bundle.css'))
	.pipe(prefix('last 2 versions', 'ie 8', '>.5%'))
	.pipe(minifyCss({compatibility: 'ie8'}))
	.pipe(rename('bundle.min.css'))
	.pipe(gulp.dest('app/css/'));
});



// concatting js
gulp.task('concatjs', function() {
	return gulp.src('/dev/_scripts/_plugins/*.js')
	.pipe(concat('vendor.js'))
	.pipe(gulp.dest('/app/js/'));
});

// server
gulp.task('server', function() {
	browserSync({
		port: 3000,
		server: {
			baseDir: 'app/html'
		}
	})
});


// watching for changes
gulp.task('watch', function() {
	gulp.watch('/_dev/_styles/scss/*.scss', ['scss'])
	gulp.watch('/_dev/_makeups/_pages/*.jade', ['jade'])
});


// default task
gulp.task('default', ['jade', 'scss', 'server']);