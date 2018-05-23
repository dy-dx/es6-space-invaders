const gulp = require('gulp');
const watchify = require('watchify');
const browserify = require('browserify');
const browserSync = require('browser-sync');
const source = require('vinyl-source-stream');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const babelify = require('babelify');

const babelOptions = {
  presets: [
    ['env', {
      targets: {
        browsers: [
          'last 2 chrome versions',
          'last 2 firefox versions',
          'last 2 safari versions',
          'not safari < 11',
        ],
      },
    }],
  ],
};

function bundle(bundler) {
  return bundler.bundle()
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
}

gulp.task('sass', () => (
  gulp.src('./src/css/**/*.scss')
    .pipe(sass())
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({
      stream: true,
    }))
));

gulp.task('pug', () => (
  gulp.src('./src/*.pug')
    .pipe(pug({
      pretty: true,
    }))
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(gulp.dest('./dist'))
));

gulp.task('watch', ['sass', 'pug'], () => {
  const bundler = watchify(browserify('./src/js/index.js', watchify.args));
  bundler.transform(babelify, babelOptions);

  bundler.on('update', () => bundle(bundler));

  browserSync({
    open: false,
    server: {
      baseDir: ['.', '.tmp', 'dist'],
    },
    port: 3030,
    ghostMode: false,
    notify: false,
  });

  gulp.watch(['src/**/*.scss'], ['sass']);
  gulp.watch(['src/**/*.pug'], ['pug']);
  gulp.watch(['src/img/**/*'], browserSync.reload);
  gulp.watch(['dist/*.!(css)'], browserSync.reload);

  return bundle(bundler);
});

gulp.task('build', ['sass', 'pug'], () => {
  const bundler = browserify('./src/js/index.js');
  bundler.transform(babelify, babelOptions);
  return bundle(bundler);
});

gulp.task('default', ['watch']);
