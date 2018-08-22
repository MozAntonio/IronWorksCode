/*
File: index.js
Versione: 2.0
Autore: Francesco Sacchetto
Registro Modifiche:
Francesco Sacchetto, creazione file, 2018-06-21
Francesco Sacchetto, stesura file, 2018-06-21
Sharon Della Libera, modifica file per permettere la creazione della cartella 
                     temporanea su cui salvare i file, 2018-07-26
Descrizione: questo file funge da middleware per gestire le chiamate REST
sulla porta 3000 e invocando i controller necessari per portare a termine 
l'azione.
*/

var path = require('path');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var formidable = require('formidable');
var archiver = require('archiver');
var jsonParser = require('./../../ApplicationTier/Components/JsonParser/jsonparser.js');
var presentationController = require("./../PresentationController/presentationcontroller.js");
var applicationController = require("./../../ApplicationTier/ApplicationController/applicationcontroller.js");



/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(presentationController.getIndex());
});

/* POST dei file zippati. */
router.post('/code', function(req, res, next) {
        let appController = new applicationController();
            appController.parsing(req.body);
            //creazione della cartella temporanea per la zip
            appController.getCode();
            //creazione della zip
            const zipfile = archiver('zip');
            zipfile.pipe(res);
            zipfile.directory('./cartellatemp', '/').finalize();
})

module.exports = router;