import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';

const sass = gulpSass(dartSass);

const paths = {
    styles: {
        src: 'src/sass/**/*.scss',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'dist/js/'
    },
    images: {
        src: 'src/assets/images/**/*',
        dest: 'dist/assets/images/'
    },
    fonts: {
        src: 'src/assets/fonts/**/*',
        dest: 'dist/assets/fonts/'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    }
};

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(uglify())
        .on('error', function (err) { console.log(err.toString()); this.emit('end'); })
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.scripts.dest));
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin({ optimizationLevel: 3 }))
        .on('error', function (err) { console.log(err.toString()); this.emit('end'); })
        .pipe(gulp.dest(paths.images.dest));
}

function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest));
}

const build = gulp.series(gulp.parallel(styles, scripts, images, fonts, html));

export { styles, scripts, images, fonts, html, build };
export default build;