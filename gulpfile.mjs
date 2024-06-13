import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import imagemin from 'gulp-imagemin';
import yargs from 'yargs';

const sass = gulpSass(dartSass);
const server = browserSync.create();
const argv = yargs.argv;
const PRODUCTION = !!argv.prod;

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
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(PRODUCTION ? gulp.noop() : server.stream());
}

function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: !PRODUCTION })
        .pipe(uglify())
        .on('error', function (err) { console.log(err.toString()); this.emit('end'); })
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(PRODUCTION ? gulp.noop() : server.stream());
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin({ optimizationLevel: 3 }))
        .on('error', function (err) { console.log(err.toString()); this.emit('end'); })
        .pipe(gulp.dest(paths.images.dest))
        .pipe(PRODUCTION ? gulp.noop() : server.stream());
}

function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(PRODUCTION ? gulp.noop() : server.stream());
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(PRODUCTION ? gulp.noop() : server.stream());
}

function serve(done) {
    if (!PRODUCTION) {
        server.init({
            server: {
                baseDir: './dist'
            }
        });
    }
    done();
}

function reload(done) {
    if (!PRODUCTION) {
        server.reload();
    }
    done();
}

function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.html.src, html).on('change', reload);
}

const dev = gulp.series(gulp.parallel(styles, scripts, images, fonts, html), serve, watch);
const build = gulp.series(gulp.parallel(styles, scripts, images, fonts, html));

export { styles, scripts, images, fonts, html, watch, build, dev };
export default PRODUCTION ? build : dev;
