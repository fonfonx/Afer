var gulp = require('gulp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify')

gulp.task('browserify', function() {
  return browserify('./frontend/app/app.js')
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./frontend/www'));
});

gulp.task('browserSync', function() {
  browserSync({
    host: '127.0.0.1',
    port: '4000',
    server: {
      baseDir: 'frontend',
    },
  })
})

gulp.task('reload', function() {
  browserSync.reload();
})

gulp.task('watch', function() {
  gulp.watch('frontend/app/**/*', ['browserify']);
  gulp.watch('frontend/www/bundle.js', ['reload'])
  gulp.watch('frontend/css/style.css', ['reload'])
  gulp.watch('frontend/index.html', ['reload'])
})

gulp.task('server', ['browserSync', 'watch']);
