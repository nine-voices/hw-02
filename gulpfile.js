// variables
var gulp			= require("gulp"),
	jade			= require('gulp-jade'),
	sass			= require('gulp-sass'),
	prettify		= require('gulp-prettify'),
	wiredep			= require('wiredep').stream,
	useref			= require('gulp-useref'),
	uglify			= require('gulp-uglify'),
	clean			= require('gulp-clean'),
	gulpif			= require('gulp-if'),
	filter			= require('gulp-filter'),
	prefix			= require('gulp-autoprefixer'),
	// size			= require('gulp-size'),
	imagemin		= require('gulp-imagemin'),
	concatCss		= require('gulp-concat-css'),
	minifyCss		= require('gulp-minify-css'),
	concat			= require('gulp-concat'),
	browserSync		= require('browser-sync'),
	gutil			= require('gulp-util'),
	ftp				= require('vinyl-ftp'),
	rename			= require('gulp-rename'),
	reload			= browserSync.reload;

// ====================================================
// ====================================================
// ============== Локальная разработка APP ============

// 01. Очистка папки dist
gulp.task('clean', function(){
	return gulp.src('dist')
		.pipe(clean());
});

// 02. wiredep вставляет в jade-файл
// ссылки на css- и js- файлы из папки _b_components
gulp.task('wiredep', function(){
	gulp.src('_dev/_makeups/_layouts/*.jade')
		.pipe(wiredep({
			ignorePath: /^(\.\.\/)*\.\./
		}))
		.pipe(gulp.dest('_dev/_makeups/_layouts/'))
});

// 03. Компилируем jade в html
gulp.task('jade', function(){
	gulp.src('./_dev/_makeups/_pages/*.jade')
		.pipe(jade({
			pretty: true
		}))
		.on('error', log)
		.pipe(gulp.dest('./dist/html/'));
		// .pipe(reload({stream: true}));
});

// 04. Сжимаем, склеиваем и складываем HTML, CSS, JS в папку dist 
gulp.task('useref', function(){
	var assets = useref.assets();
	return gulp.src('dist/*.html')
		.pipe(assets)
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

// 05. Компилируем наши scss в css
// вставляем префиксы, минифицируем, переименовываем
// и складываем в папку dist
gulp.task("sass", function(){
	gulp.src("./_dev/_styles/**/*.scss")
		.pipe(sass())
		.pipe(prefix('last 2 versions', 'ie 8', '>.5%'))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest("./dist"));
});

// 06. Склеиваем и аглифицируем наши js, переименовываем
// и складываем в папку dist
gulp.task('js', function() {
	return gulp.src('/_dev/_scripts/**/*.js')
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest('/dist'));
});


// Переносим шрифты
gulp.task('fonts', function(){
	gulp.src('__source_data/fonts/source_fonts/*')
		.pipe(filter(['*.eot','*.svg','*.ttf','*.woff','*.woff2']))
		.pipe(gulp.dest('dist/fonts/'))
});

// Сжамаем и переносим картинки
gulp.task('images', function(){
	return gulp.src('app/img/**/*')
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('dist/img'));
});

// Собираем папку dist
gulp.task('build', function(){
	gulp.run(['clean', 'wiredep', 'jade', 'useref', "sass", "js", "fonts", "images"]);
});

// Запускаем локальный сервер из собранной папки dist
gulp.task('server', ['build'], function(){
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: 'dist'
		}
	});
});

// слежка и запуск задач 
gulp.task('watch', function(){
	gulp.watch('_dev/_makeups/_pages/*.jade', ['jade']);
	gulp.watch('bower.json', ['wiredep']);
	gulp.watch('_dev/_scripts/**/*.js', ['js']);
	gulp.watch('_dev/_styles/**/*.scss', ['sass'])
	.on('change', reload);
});

// Задача по-умолчанию 
gulp.task('default', ['server', 'watch']);


// ====================================================
// ====================================================
// ===================== Функции ======================

// Более наглядный вывод ошибок
var log = function(error){
	console.log([
		'',
		"----------ERROR MESSAGE START----------",
		("[" + error.name + " in " + error.plugin + "]"),
		error.message,
		"----------ERROR MESSAGE END----------",
		''
	].join('\n'));
	this.end();
}

// ====================================================
// ====================================================
// =============== Важные моменты  ====================
// gulp.task(name[, deps], fn) 
// deps - массив задач, которые будут выполнены ДО запуска задачи name
// внимательно следите за порядком выполнения задач!


// ====================================================
// ====================================================
// ================= Сборка DIST ======================


// Остальные файлы, такие как favicon.ico и пр.
gulp.task('extras', function(){
  return gulp.src([
	'app/*.*',
	'!app/*.html'
  ]).pipe(gulp.dest('dist'));
});


// ====================================================
// ====================================================
// ===== Отправка проекта на сервер ===================

gulp.task('deploy', function(){

  var conn = ftp.create( {
	  host:     'testtest.kovalchuk.us',
	  user:     'kovaldn_test',
	  password: 'test',
	  parallel: 10,
	  log: gutil.log
  } );

  var globs = [
	  'dist/**/*'
  ];

  return gulp.src(globs, { base: 'dist/', buffer: false })
	.pipe(conn.dest( 'public_html/'));

});