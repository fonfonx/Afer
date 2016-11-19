var gulp = require('gulp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');

gulp.task('browserSync', function() {
  browserSync({
    host: '127.0.0.1',
    port: '4000',
    server: {
      baseDir: 'app',
    },
  })
})

gulp.task('reload', function() {
  browserSync.reload();
})

gulp.task('watch', function() {
  gulp.watch('app/**/*', ['reload']);
})

gulp.task('server', ['browserSync', 'watch']);
