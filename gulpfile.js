import dartSass from "sass"
import gulpSass from "gulp-sass"
import imagemin from "gulp-imagemin"
import concat from"gulp-concat"
import del from "del"
import rename from "gulp-rename"
import uglify from "gulp-uglify"
import pkg from 'gulp'
import brows from "browser-sync"
import htmlMin from "gulp-htmlmin"

const {src, dest, series,parallel, watch} = pkg;
const scss = gulpSass(dartSass);
const sync = brows.create();




function images(){
    return src("./src/images/**")
        .pipe(imagemin())
        .pipe(dest("./dest/images"));
}

function sass(){
    return src("./src/scss/**/*.scss")
        .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
        .pipe(concat("file"))
        .pipe(rename({
            basename: "style",
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest("./dest/css"));
}

function css(){
    return src("./src/css/**/*.css")
        .pipe(concat("reset.css"))
        .pipe(dest("./dest/css"));
}



function html(){
    return src("./src/*.html")
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(dest("./dest"));


}



function clear(){
    return del("./dest/**");
}

function serve(){
    sync.init({
        server: "./dest"
    })

    watch("./src/scss/**/*.scss", series(sass)).on("change", sync.reload);
    watch("./src/images/**", series(images)).on("change", sync.reload);
    watch("./src/*.html",series(html)).on("change", sync.reload);


}



let buildProd = series(clear, parallel(html,css, sass, images));
let buildDev = series(clear, parallel(html,css, sass, images), serve);
export {buildProd, buildDev};

