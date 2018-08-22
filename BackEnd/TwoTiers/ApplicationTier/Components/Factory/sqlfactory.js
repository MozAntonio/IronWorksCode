/*
File: sqlfactory.js
Versione: 2.0
Autore: Sharon Della Libera
Registro Modifiche:
Sharon Della Libera, creazione file, 2018-06-25
Sharon Della Libera, creazione classe SqlFactory, 2018-06-26
Sharon Della Libera, implementazione metodi, 2018-06-28
Sharon Della Libera, versione ufficiale, 2018-06-28
Sharon Della Libera, ristrutturazione file, 2018-07-29
Descrizione: la classe SqlFactory estende la factory base.
Crea l'array con un file Sql unico prelevando le entità
dall'istanza della classe jsonParser.
Crea quindi un unico file e per ogni entità i contenuti.
*/

var factory = require('./factory.js');
var jsonParser = require('./../JsonParser/jsonparser.js');
var fs = require('fs');
var sqlFile = require('./sqlfile.js');
var sqlContents = require('./sqlfilecontent.js');
class SqlFactory extends factory {
    constructor(){
        super();
        //crea il file SQL
        if(jsonParser.entityArray.length >= 1)
        var f = this.createFile("scriptTables");
        //genera e inserisce nel file i contenuti per ogni entità.
        for(let i in jsonParser.entityArray){
            fs.appendFile(f.path, this.createContent(jsonParser.entityArray[i]));
        }
    }
    /* Descrizione: il metodo crea il file .sql che ospiterà il codice.
      Parametri: fileName, stringa, nome del file da creare.
   */
    createFile(fileName) {
        return new sqlFile(fileName).file;
    }
    /* Descrizione: il metodo crea il codice da inserire nel file.sql,
       sottoforma di stringa che ritona per essere iniettata nel file.
       Parametri: entity, entità, l'entità da utilizzare per generare i contenuti.
       Con contentuto si intende la tabella SQL generata dai dati dell'entità.
    */
    createContent(entity) {
        var sc = new sqlContents(entity);
        return sc.contents;
    }
}

module.exports=SqlFactory;