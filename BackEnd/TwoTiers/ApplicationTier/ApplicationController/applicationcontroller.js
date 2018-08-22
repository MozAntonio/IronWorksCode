/*
File: applicationcontroller.js
Versione: 3.0
Autore: Francesco Sacchetto
Registro Modifiche:
Frnacesco Sacchetto, creazione file, 2018-06-21
Mirko Gibin, creazione classe ApplicationController, 2018-06-25
Mirko Gibin, modifica costruttore classe, 2018-06-28
Mirko Gibin, versione ufficiale, 2018-06-28
Sharon Della Libera, rimozione campo dati file [], 2018-07-29
Sharon Della Libera, aggiunta rimozione directory, 2018-07-30
Descrizione: la classe Application Controller funge da controller per interagire
con i componenti del back-end. Si occupa di creare una struttura JSON adatta
alla manipolazione, di generare il codice e di svuotare la cartella temporanea
per permettere l'inserimento di nuovi file
*/

var jsonParser = require("./../Components/JsonParser/jsonparser.js");
var javaFactory = require("./../Components/Factory/javafactory.js");
var sqlFactory = require("./../Components/Factory/sqlfactory.js");
var daoFactory = require("./../Components/Factory/daofactory.js");
var hibernateFactory = require("./../Components/Factory/hibernatefactory.js");
var fs = require('fs');

class ApplicationController {
    constructor() {}
    /* Descrizione: il metodo crea l'istanza della classe jsonParser (singleton) che
       si occupa di rendere la struttura del file contentente le informazioni del diagramma
       maneggevole.
       Parametri: data, oggetto, dati contenuti nel file JSON parsati per essere accessibili.
    */
    parsing(data) {
        let jsonStructure = new jsonParser(data);
    }

    /*Descrizione: il metodo svuota la cartella temporanea per poi poterla riempire
      Parametro: path, pecorso, percorso della cartella da eliminare
    */

    deleteFolder(path) {
        var deleteFolderRecursive = function(path) {
            if (fs.existsSync(path)) {
                fs.readdirSync(path).forEach(function(file, index){
                    var curPath = path + "/" + file;
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path);
            }
        };
        deleteFolderRecursive(path);
    }

    /* Descrizione: il metodo istanzia le factory per la creazione dei file necessari
                    e invoca l'eliminazione delle cartelle generate temporaneamente
       Parametri: nessuno.
    */
    getCode() {
        if (fs.existsSync('./cartellatemp'))
            this.deleteFolder('./cartellatemp');

        fs.mkdirSync('./cartellatemp');

        let factoryJava = new javaFactory();
        let factorySql = new sqlFactory();
        let factoryDao = new daoFactory();
        let factoryHibernate = new hibernateFactory();
    }
}

module.exports = ApplicationController;