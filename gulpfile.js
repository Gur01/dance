var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var notify = require('gulp-notify');
var path = require('path');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var del = require('del');
var ftp = require('vinyl-ftp');
var imagemin = require('gulp-imagemin');
var gutil  = require('gulp-util');
var browserSync = require('browser-sync').create();


//task for js libraries (not watching), use after adding some lib
gulp.task('js-libs', function(){
	return gulp.src([
			'./libs/jquery/dist/jquery.js',
			'./libs/owl.carousel/dist/owl.carousel.js',
			'./libs/waypoints/lib/jquery.waypoints.js'
		])
		.pipe(concat('libs.js'))
			//.pipe(uglify())
				.pipe(gulp.dest('./app/js/'));
})

//task to conkat and minify main.js and libs
gulp.task('js', function(){
	return gulp.src([
			'./app/js/libs.js',
			'./app/js/main.js'
		])
		.pipe(concat('js.min.js'))
			.pipe(uglify())
				.pipe(gulp.dest('./app/js/'));
})

//task for starting server
gulp.task('serve', function() {
    browserSync.init({
        server: "./app"
    });
});

// task for sass
gulp.task('sass', function(){
	return gulp.src('./app/sass/style.sass')
		.pipe(sass({outputStyle: 'expanded'})
			.on('error', notify.onError(function(err) {
				return {
					'title': 'Sass',
					'message': err.message,
					"icon": path.join(__dirname, "./misc/sass.png")
				};
			})))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./app/css/'))
		.pipe(browserSync.stream())
		.pipe(notify({
			'title': 'Sass',
			'message': 'Sass compiled',
	        "icon": path.join(__dirname, "./misc/sass.png")
		}));
});

// task for pug
gulp.task('pug', function(){
	return gulp.src('./app/*.pug')
		.pipe(pug({
			pretty: true
		}).on('error', notify.onError(function(err) {
				return {
					"title": 'Pug',
					"message": err.message,
					"icon": path.join(__dirname, "./misc/pug.png")
				};
			})))
		.pipe(gulp.dest('./app/'))
		.pipe(browserSync.stream())
		.pipe(notify({
			"title": 'Pug',
			"message": 'Pug compiled',
			"icon": path.join(__dirname, "./misc/pug.png")
		}));
});

// watch task
gulp.task('watch', ['pug', 'sass', 'js', 'serve'], function(){
	gulp.watch('./app/sass/**/*+(sass|scss)', ['sass']);
	gulp.watch('./app/**/*.pug', ['pug']);
	//gulp.watch('./app/js/*.js', ['js']);
});

//tasks for dist
gulp.task('removedist', function(){
	return del('dist');
});
gulp.task('imagemin', function(){
	return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
});

// task for build
gulp.task('build', ['removedist', 'pug', 'sass', 'js'], function(){
	var buildCss = gulp.src('app/css/*.css')
		.pipe(cleanCss())
			.pipe(gulp.dest('dist/css'));
	var buildFonts = gulp.src('app/fonts/**/*.*')
		.pipe(gulp.dest('dist/fonts'));
	var buildVideo = gulp.src('app/video/**/*.*')
		.pipe(gulp.dest('dist/video'));
	var buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));
	var js = gulp.src('app/js/js.min.js')
		.pipe(gulp.dest('dist/js'));
  var img = gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
		.pipe(imagemin())
			.pipe(gulp.dest('dist/img'));
});

//task for deploy on server
gulp.task('deploy', function(){
var conn = ftp.create({
      host:     'host-name',
      user:     'user',
      password: 'pass',
      parallel: 10,
      log:      gutil.log
  });
var globs = [
	'dist/**'
];
return gulp.src( globs, { base: './dist/', buffer: false } )
        .pipe( conn.newer( '/domains/honey-pot.ru' ) ) // only upload newer files 
        .pipe( conn.dest( '/domains/honey-pot.ru' ) );
});


// default task
gulp.task('default', ['watch']);