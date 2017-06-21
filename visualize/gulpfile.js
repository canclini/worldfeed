var gulp = require("gulp");
var browserify = require("browserify");
var reactify = require("reactify");
var source = require("vinyl-source-stream");

gulp.task("bundle", function () {
    return browserify({
        entries: "./app/main.jsx",
        debug: true
    }).transform(reactify)
        .bundle()
        .pipe(source("main.js"))
        .pipe(gulp.dest("app/dist"))
});

gulp.task("copy", ["bundle"], function () {
    return gulp.src(["app/index.html","app/lib/bootstrap-css/css/bootstrap.min.css","app/style.css"])
        .pipe(gulp.dest("app/dist"));
});

/**
 * The default task that is run with the
 * gulp command when not task is specified.
 * The scss task is required to run before
 * this one.
 *
 * Watch for changes in the JSX-Files
 */
gulp.task('default', ['copy'], function() {
   console.log("Gulp completed..."); 
   gulp.watch(['./app/main.jsx', './app/components/*'], ['copy']);
});
