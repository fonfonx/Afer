var gulp = require('gulp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('browserify', function() {
  return browserify('./app/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./www'));
});

gulp.task('browserSync', function() {
  browserSync({
    host: '127.0.0.1',
    port: '4000',
    server: {
      baseDir: '.',
    },
  })
})

gulp.task('reload', function() {
  browserSync.reload();
})

gulp.task('watch', function() {
  gulp.watch('app/**/*', ['browserify']);
  gulp.watch('www/bundle.js', ['reload'])
  gulp.watch('index.html', ['reload'])
})

gulp.task('server', ['browserSync', 'watch']);
