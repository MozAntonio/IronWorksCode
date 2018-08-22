/*
File: hibernatefactory.js
Versione: 1.0
Autore: Sharon Della Libera
Registro Modifiche:
Sharon Della Libera, creazione file, 2018-07-26
Sharon Della Libera, stesura file, 2018-07-26
Descrizione: la classe HibernateFactory estende la factory base.
Per ogni entità crea il file e i contenuti che costituiscono l'interazione col database
attraverso l'ORM Hibernate.
*/

var factory = require('./factory.js');
var jsonParser = require('./../JsonParser/jsonparser.js');
var fs = require('fs');
var hibernateFile = require('./hibernatefile.js');
var hibernateContents = require('./hibernatefilecontent.js');

class HibernateFactory extends factory {
    constructor(){
        super();
        //creo la cartella per salvare i file
        //fs.mkdirSync('./cartellatemp/hibernate');
        fs.mkdirSync('./cartellatemp/hibernate/dao');
        //fs.mkdirSync('./cartellatemp/hibernate/entities');
        //crea i file di supporto per la configurazione del database
        this.copyFile('./fileTemplates/jdbcHelpers/hibernate.cfg.xml', './cartellatemp/hibernate.cfg.xml');
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
        return new hibernateFile(fileName).file;
    }
    /* Descrizione: il metodo crea il codice da inserire nel fileDao.java,
       sottoforma di stringa che ritona per essere iniettata nel file.
       Parametri: entity, entità, l'entità da utilizzare per generare i contenuti.
       Con contentuto si intende la classe Java generata dai dati dell'entità.
    */
    createContent(entity) {
        var hc = new hibernateContents(entity);
        return hc.contents;
    }
}

module.exports=HibernateFactory;