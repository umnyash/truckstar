import gulp from 'gulp';

// Configuration
import mode from '../mode.js';
import paths from '../paths.js';

// Plugins
import babel from 'gulp-babel';
import browser from 'browser-sync';
import gulpIf from 'gulp-if';
import terser from 'gulp-terser';

export default function processDemoScript() {
  return gulp.src(paths.processDemoScript.src)
    .pipe(babel())
    .pipe(terser())
    .pipe(gulp.dest(paths.processDemoScript.dest))
    .pipe(gulpIf(mode.isDev, browser.stream()));
}
