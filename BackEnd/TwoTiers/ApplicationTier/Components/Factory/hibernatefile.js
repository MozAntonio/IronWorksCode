/*
File: hibernate.js
Versione: 1.0
Autore: Sharon Della Libera
Registro Modifiche:
Sharon Della Libera, creazione file, 2018-07-26
Sharon Della Libera, stesura file, 2018-07-26
Descrizione: la classe HibernateFile crea il file.java
a partire dal nome dell'entità per Hibernate
*/

var file = require('./file.js');
var fs = require('fs');

class HibernateFile extends file {
    constructor(fileName) {
        super();
        var fileJava = fileName+"Dao.java";
        fs.writeFileSync('./cartellatemp/hibernate/dao/' + fileJava, '', function(err,file) {
            if (err) {
                throw err;
            }
        })
        this.file = {path: './cartellatemp/hibernate/dao/' + fileJava, name: fileJava};
    }
}

module.exports=HibernateFile;