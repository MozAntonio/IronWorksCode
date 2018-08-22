/*
File: javafile.js
Versione: 2.0
Autore: Mirko Gibin
Registro Modifiche:
Mirko Gibin, creazione file, 2018-06-26
Mirko Gibin, creazione classe JavaFile, 2018-06-26
Mirko Gibin, versione ufficiale, 2018-06-28
Mirko Gibin, modifica classe e aggiunta del campo dati per
             hibernate, 2018-07-30
Descrizione: la classe JavaFile crea il file.java
a partire dal nome dell'entità
*/

var file = require('./file.js');
var fs = require('fs');

class JavaFile extends file {
    constructor(fileName) {
        super();
        var fileJava = fileName+".java";
        fs.writeFileSync('./cartellatemp/jdbc/entities/' + fileJava, '', function(err,file) {
            if (err) {
                throw err;
            }
        })
        fs.writeFileSync('./cartellatemp/hibernate/entities/' + fileJava, '', function(err,file) {
            if (err) {
                throw err;
            }
        })
        this.fileJava = {path: './cartellatemp/jdbc/entities/' + fileJava, name: fileJava};
        this.fileHib =  {path: './cartellatemp/hibernate/entities/' + fileJava, name: fileJava};
    }
}

module.exports=JavaFile;