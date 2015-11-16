var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var babelify = require('babelify');

function bundle (bundler) {
  return bundler.bundle()
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
}

gulp.task('sass', function() {
  return gulp.src('./src/css/**/*.scss')
    .pipe(sass())
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('jade', function() {
  return gulp.src('./src/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['sass', 'jade'], function() {
  var bundler = watchify(browserify('./src/js/index.js', watchify.args));
  bundler.transform(babelify, {presets: ["es2015", "react"]});

  bundler.on('update', function () { return bundle(bundler); });

  browserSync({
    open: false,
    server: {
      baseDir: ['.', '.tmp', 'dist']
    },
    port: 3030,
    ghostMode: false,
    notify: false
  });

  gulp.watch(['src/**/*.scss'], ['sass']);
  gulp.watch(['src/**/*.jade'], ['jade']);
  gulp.watch(['src/img/**/*'], browserSync.reload);
  gulp.watch(['dist/*.!(css)'], browserSync.reload);

  return bundle(bundler);
});

gulp.task('build', ['sass', 'jade'], function () {
  var bundler = browserify('./src/js/index.js');
  bundler.transform(babelify, {presets: ["es2015", "react"]});
  return bundle(bundler);
});

gulp.task('default', ['watch']);
