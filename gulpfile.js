const gulp = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');

gulp.task('clean', function () {  
    return gulp.src('./dist', {read: false})
        .pipe(clean());
});

gulp.task('sass', () => {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/css'))
})

gulp.task('js', () => {
    return gulp.src('./src/js/*.js')
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(rename('bundle.min.js'))
        .pipe(gulp.dest('./dist/js'))
})

gulp.task('minify-image', () => {
    return gulp.src('./src/img/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
        .pipe(gulp.dest('./dist/img'))
});

gulp.task('dev',['build'], () => {
    browserSync.init({
        server: './'
    })

    gulp.watch('./src/js/*.js', ['js']).on('change', browserSync.reload);
    gulp.watch('./src/sass/**/*.scss', ['sass']).on('change', browserSync.reload);
    gulp.watch('./index.html').on('change', browserSync.reload)
})

gulp.task('build', function(callback) {
    runSequence('clean',
                ['sass', 'js', 'minify-image'],
                callback);
  });

  gulp.task('default', ['dev']);

  


