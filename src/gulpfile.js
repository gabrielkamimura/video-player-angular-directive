var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    globbing = require('gulp-css-globbing'),
    replace = require('gulp-replace-task'),
    args = require('yargs').argv,
    fs = require('fs'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    express = require('express');


/**
 * Task para verificar alterações em arquivos e executar ações. Executado ao digitar gulp
 * terminal
 */
gulp.task('watch', function () {
    gulp.watch('scss/componentes/*.scss', ['style', 'minify-css']);
    gulp.watch(['./app/bookcard.js', './app/bookcard.spec.js', './app/temas.js'], ['scripts']);
    gulp.watch('./app/**/*.js', ['scripts']);

});


/**
 * Faz com que Task ao digitar gulp no terminal seja a Watch
 */
gulp.task('default', ['watch'], function () {

});


/**
 * Task para minificar e processar arquivos .scss em .css
 */
gulp.task('style', function () {
    gulp.src(['./app/shared/style/vars.scss', './app/shared/style/mixins.scss', './app/shared/style/*.scss', './app/modules/*/*.scss', './app/shared/*/*.scss'])
        .pipe(concat('style.min.scss'))
        .pipe(globbing({
            extensions: ['.scss']
        }))
        .pipe(sass())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./app'));
    
    console.log("* Folha de estilo style.css criada");

});


/**
 * Task para concatenar e minificar arquivos .js do projeto
 */
gulp.task('scripts', function () {
    return gulp.src(['./app/app.js', './app/constants.js', './app/modules/*/*Routes.js', './app/modules/*/*Ctrl.js', './app/modules/*/*Service.js', './app/shared/*/*.js'])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app'));
    
    console.log("* Scripts concatenados e minificados em app.min.js");
    
});

/**
 * Task para configurações de ambiente
 */
gulp.task('ambiente', function () {
    var amb = args.amb || 'localdev';

    var filename = amb + '.json',
        settings = JSON.parse(fs.readFileSync('configs/' + filename, 'utf8')),
        stg = "", // A string que sustituirá a base resente no arquivo bookcard-constants.js
        base = '.constant(:prop, :value)'; // A base para recriação dos itens a serem generalizados
    
    for (var i in settings) {
        stg += base.replace(':prop', ('"' + i + '"')).replace(':value', ('"' + settings[i] + '"'));
    }
    
    gulp.src('configs/constants.js')
        .pipe(replace({
            patterns: [
                    {
                        match: 'settings',
                        replacement: stg
                    }
                ]
            }
        ))
        .pipe(gulp.dest('app/'));
    
    console.log("* Configurações de ambiente aleradas para: " + amb);
    
});