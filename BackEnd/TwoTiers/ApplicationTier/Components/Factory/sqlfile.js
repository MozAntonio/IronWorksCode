/*
File: sqlfile.js
Versione: 1.0
Autore: Sharon Della Libera
Registro Modifiche:
Sharon Della Libera, creazione file, 2018-06-26
Sharon Della Libera, creazione classe JavaFile, 2018-06-26
Sharon Della Libera, versione ufficiale, 2018-06-28
Descrizione: la classe SqlFile crea il file.sql
*/

var file = require('./file.js');
var fs = require('fs');

class SqlFile extends file {
    constructor(fileName) {
        super();
        var fileSql = fileName+".sql";
        fs.writeFileSync('./cartellatemp/' + fileSql, '', function(err,file) {
            if (err) {
                throw err;
            }
        })
        this.file = {path: './cartellatemp/' + fileSql, name: fileSql};
    }
}

module.exports=SqlFile;