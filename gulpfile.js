var gulp = require('gulp'),  
    less = require('gulp-less'), // compiles less to CSS
    //autoprefixer = require('gulp-autoprefixer'), // CSS browser compatibility
    cssmin = require('gulp-cssmin'); // minifies CSS

gulp.task('watch', function () {
    gulp.watch(['./resources/less/*.less'], ['less']);
});

gulp.task('less', function () {
    gulp.src(['./resources/less/style.less'])
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['less', 'watch']);


