import fs from "fs";
import gulp from "gulp";
import { merge } from "event-stream";
import browserify from "browserify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import rename from "gulp-rename";
import preprocessify from "preprocessify";
import tsify from "tsify";
import uglify from "gulp-uglify-es";
import gulpif from "gulp-if";
const $ = require("gulp-load-plugins")();

var production = process.env.NODE_ENV === "production";
var target = process.env.TARGET || "chrome";
var environment = process.env.NODE_ENV || "development";

var generic = JSON.parse(fs.readFileSync(`./config/${environment}.json`));
var specific = JSON.parse(fs.readFileSync(`./config/${target}.json`));
var context = Object.assign({}, generic, specific);

var manifest = {
  dev: {
    background: {
      scripts: ["scripts/livereload.js", "scripts/background.js"]
    }
  },

  firefox: {
    applications: {
      gecko: {
        id: "extension@improved-initiative.com"
      }
    }
  }
};

// Tasks
gulp.task("clean", () => {
  return pipe(
    `./build/${target}`,
    $.clean()
  );
});

gulp.task("manifest", () => {
  return gulp
    .src("./manifest.json")
    .pipe(
      gulpif(
        !production,
        $.mergeJson({
          fileName: "manifest.json",
          jsonSpace: " ".repeat(4),
          endObj: manifest.dev
        })
      )
    )
    .pipe(
      gulpif(
        target === "firefox",
        $.mergeJson({
          fileName: "manifest.json",
          jsonSpace: " ".repeat(4),
          endObj: manifest.firefox
        })
      )
    )
    .pipe(gulp.dest(`./build/${target}`));
});

gulp.task("js", done => {
  return buildJS(target, done);
});

gulp.task("styles", () => {
  return gulp
    .src("src/styles/**/*.scss")
    .pipe($.plumber())
    .pipe(
      $.sass
        .sync({
          outputStyle: "expanded",
          precision: 10,
          includePaths: ["."]
        })
        .on("error", $.sass.logError)
    )
    .pipe(gulp.dest(`build/${target}/styles`));
});

gulp.task(
  "ext",
  gulp.parallel(["manifest", "js"], done => mergeAll(target).on("end", done))
);

gulp.task("build", gulp.series(["clean", "styles", "ext"]));

// -----------------
// DIST
// -----------------
gulp.task("zip", () => {
  return pipe(
    `./build/${target}/**/*`,
    $.zip(`${target}.zip`),
    "./dist"
  );
});

gulp.task("dist", gulp.series(["build", "zip"]));

gulp.task(
  "watch",
  gulp.series(["build"], () => {
    $.livereload.listen();
    gulp.watch(["./src/**/*"], gulp.series(["build"]));
  })
);

gulp.task("default", gulp.series(["build"]));

// Helpers
function pipe(src, ...transforms) {
  return transforms.reduce((stream, transform) => {
    const isDest = typeof transform === "string";
    return stream.pipe(isDest ? gulp.dest(transform) : transform);
  }, gulp.src(src, { allowEmpty: true }));
}

function mergeAll(dest) {
  return merge(
    pipe(
      "./src/icons/**/*",
      `./build/${dest}/icons`
    ),
    pipe(
      ["./src/_locales/**/*"],
      `./build/${dest}/_locales`
    ),
    pipe(
      [`./src/images/${target}/**/*`],
      `./build/${dest}/images`
    ),
    pipe(
      ["./src/images/shared/**/*"],
      `./build/${dest}/images`
    ),
    pipe(
      ["./src/**/*.html"],
      `./build/${dest}`
    )
  );
}

function buildJS(target, done) {
  const files = [
    "background.ts",
    "contentscript.ts",
    "optionseditor.tsx",
    "popup.tsx",
    "livereload.ts"
  ];

  let tasks = files.map(file => {
    return browserify({
      entries: "src/scripts/" + file,
      debug: true
    })
      .plugin(tsify)
      .transform("babelify", { presets: ["es2015"] })
      .transform(preprocessify, {
        includeExtensions: [".ts, .tsx"],
        context: context
      })
      .bundle()
      .pipe(source(file))
      .pipe(buffer())
      .pipe(gulpif(!production, $.sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(!production, $.sourcemaps.write("./")))
      /*.pipe(
        gulpif(
          production,
          uglify({
            mangle: false,
            output: {
              ascii_only: true
            }
          })
        )
      )*/
      .pipe(
        rename({
          extname: ".js"
        })
      )
      .pipe(gulp.dest(`build/${target}/scripts`));
  });

  return merge(tasks).on("end", done);
}
