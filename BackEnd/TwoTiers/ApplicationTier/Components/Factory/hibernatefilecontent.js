/*
File: hibernatefilecontent.js
Versione: 1.0
Autore: Sharon Della Libera
Registro Modifiche:
Sharon Della Libera, creazione file, 2018-07-26
Sharon Della Libera, stesura file, 2018-07-26
Mirko Gibin, correzione file, 2018-07-29
Descrizione: la classe HibernateFileContent implementa i metodi necessari
per generare i contenuti del file.
*/

var fileContent = require('./filecontent.js');
var fs = require("fs");
class HibernateFileContent extends fileContent {
    constructor(entity) {
        super();
        this.contents = this.createContent(entity);
    }

    /* Descrizione: il metodo crea l'intestazione del file
      Parametri: entity, entità, dati necessari per generare l'intestazione.
   */
    createHeader(entity) {
        var head = fs.readFileSync("fileTemplates/hibernate/header.txt");
        var stringHead = head.toString();
        return (stringHead).split("[CLASSNAME]").join(entity.name) + "\n\n\t";
    }

    /* Descrizione: il metodo crea il metodo di inserimento di un record nel file
     Parametri: entity, entità, dati necessari per generare l'intestazione.
     */
    insertMethod(entity) {
        var insert = fs.readFileSync("fileTemplates/hibernate/insert.txt");
        var stringInsert = insert.toString();
        stringInsert = stringInsert.split("[INSTANCENAME]").join(entity.name.toLowerCase());
        return (stringInsert).split("[CLASSNAME]").join(entity.name) + "\n\n\t";
    }

    /* Descrizione: il metodo crea il metodo di lettura di un record nel file
     Parametri: entity, entità, dati necessari per generare l'intestazione.
     */
    readMethod(entity) {
        var read = fs.readFileSync("fileTemplates/hibernate/read.txt");
        var stringRead = read.toString();
        stringRead = stringRead.split("[INSTANCENAME]").join(entity.name.toLowerCase());
        return (stringRead).split("[CLASSNAME]").join(entity.name) + "\n\n\t";
    }

    /* Descrizione: il metodo crea il metodo di lettura di un record di una tabella referenziata
     Parametri: entity, entità, dati necessari per generare l'intestazione.
     */
    readAllMethod(entity) {
        var readaAll = fs.readFileSync("fileTemplates/hibernate/readall.txt");
        var stringReadAll = readaAll.toString();
        return (stringReadAll).split("[CLASSNAME]").join(entity.name) + "\n\n\t";
    }

    /* Descrizione: il metodo crea il metodo di delete di un record nel file
     Parametri: entity, entità, dati necessari per generare l'intestazione.
     */
    deleteMethod(entity) {
        var del = fs.readFileSync("fileTemplates/hibernate/delete.txt");
        var stringDelete = del.toString();
        stringDelete = stringDelete.split("[INSTANCENAME]").join(entity.name.toLowerCase());
        return (stringDelete).split("[CLASSNAME]").join(entity.name) + "\n\n\t";
    }

    /* Descrizione: il metodo crea il metodo di calcolo dell'ultimo indice id della tabella
     Parametri: entity, entità, dati necessari per generare l'intestazione.
     */
    lastIdMethod(entity) {
        var lastId = fs.readFileSync("fileTemplates/hibernate/lastid.txt");
        var stringLastId = lastId.toString();
        return (stringLastId).split("[CLASSNAME]").join(entity.name) + "\n";
    }

    createContent(entity) {
        return this.createHeader(entity) + this.insertMethod(entity) + this.readMethod(entity) +
               this.readAllMethod(entity) + this.deleteMethod(entity) + this.lastIdMethod(entity) + "}";
    }
}

module.exports = HibernateFileContent;