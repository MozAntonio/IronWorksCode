/*
File: app.js
Versione: 1.0
//Autore:
//Registro Modifiche:
Francesco Sacchetto, aggiunte le route corrette, 2018-06-21
Descrizione: file generato automaticamente che setta le variabili e i path
che l'applicazione dovrà usare.
*/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./TwoTiers/PresentationTier/Middleware/index.js');


var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, './../FrontEnd')));

app.use(express.static('./../FrontEnd'));


app.use('/', indexRouter);

// error handler
app.use(require('./TwoTiers/PresentationTier/Middleware/errorhandler.js').handler);


module.exports = app;
