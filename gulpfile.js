import gulp from 'gulp';
import uglify from 'gulp-uglify'
import del from 'del';

gulp.task('clean', () => del(['./app/views/casa/errors/external/casa.css']));

// Gulp task to minify JavaScript files
gulp.task('timeout', function() {
    return gulp.src('app/src/timeout.js')
        // Minify the file
        .pipe(uglify())
        // Output
        .pipe(gulp.dest('dist/assets/js'))
});