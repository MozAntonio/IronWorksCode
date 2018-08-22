/*
File: daofile
Versione: 1.0
Autore: Mirko Gibin
Registro Modifiche: Mirko Gibin, creazione file, 2018-07-26
Registro modifiche, Mirko Gibin, stesura file, 2018-07-26
Descrizione: la classe DaoFile crea il file.java
a partire dal nome dell'entità per la gestione della persistenza
*/

var file = require('./file.js');
var fs = require('fs');

class DaoFile extends file {
    constructor(fileName) {
        super();
        //creazione del file nameDao.java
        var fileDao = fileName+"Dao.java";
        fs.writeFileSync('./cartellatemp/jdbc/dao/' + fileDao, '', function(err,file) {
            if (err) {
                throw err;
            }
        })
        this.file = {path: './cartellatemp/jdbc/dao/' + fileDao, name: fileDao};
    }
}

module.exports=DaoFile;