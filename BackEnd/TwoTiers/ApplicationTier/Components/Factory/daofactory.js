/*
File: daofactory.js
Versione: 1.0
Autore: Mirko Gibin
Registro Modifiche:
Mirko Gibin, creazione file, 2018-07-26
Mirko Gibin, stesura file, 2018-07-26
Sharon Della Libera, modifica costruttore, 2018-07-27
Descrizione: la classe DaoFactory estende la factory base.
Crea l'array di file Data Access Object di Java prelevando le entità dall'istanza della classe jsonParser.
Per ogni entità crea il file e i contenuti.
*/

var factory = require('./factory.js');
var jsonParser = require('./../JsonParser/jsonparser.js');
var fs = require('fs');
var daoFile = require('./daofile.js');
var daoContents = require('./daofilecontent.js');

class DaoFactory extends factory {
    constructor(){
        super();
        //creo la cartella per salvare i file
        fs.mkdirSync('./cartellatemp/jdbc/dao');
        fs.mkdirSync('./cartellatemp/jdbc/helpers');
        //crea i file di supporto per la configurazione del database
        this.copyFile('./fileTemplates/jdbcHelpers/config.properties', './cartellatemp/config.properties');
        this.copyFile('./fileTemplates/jdbcHelpers/Database.java', './cartellatemp/jdbc/helpers/Database.java');
        this.copyFile('./fileTemplates/App.java', './cartellatemp/App.java');
        //per ogni entità è necesssario creare il file e i contenuti
        for(let i in jsonParser.entityArray){
            var f = this.createFile(jsonParser.entityArray[i].name);
            //aggiunge i contenuti al file
            fs.appendFile(f.path, this.createContent(jsonParser.entityArray[i]));
        }
    }

    /*Descrizione: il metodo copia dei file già presente nel server che sono sempre uguali e devono essere messi nella zip
      Parametri: pathsource e pathdest, percorsi, percorsi per individuare la risorsa e la sua destinazione
    */
    copyFile(pathsource, pathdest) {
        var source = fs.createReadStream(pathsource);
        var dest = fs.createWriteStream(pathdest);
        source.pipe(dest);
    }
    /* Descrizione: il metodo crea il fileDao.java che ospiterà il codice della classe dao.
       Parametri: fileName, stringa, nome del file da creare.
    */
    createFile(fileName) {
        return new daoFile(fileName).file;
    }
    /* Descrizione: il metodo crea il codice da inserire nel fileDao.java,
       sottoforma di stringa che ritona per essere iniettata nel file.
       Parametri: entity, entità, l'entità da utilizzare per generare i contenuti.
       Con contentuto si intende la classe Java generata dai dati dell'entità.
    */
    createContent(entity) {
        var dc = new daoContents(entity);
        return dc.contents;
    }
}

module.exports=DaoFactory;