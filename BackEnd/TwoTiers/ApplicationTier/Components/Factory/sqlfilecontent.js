/*
File: sqlfilecontent.js
Versione: 2.0
Autore: Sharon Della Libera
Registro Modifiche:
Sharon Della Libera, creazione file, 2018-06-27
Sharon Della Libera, creazione classe javafilecontent, 2018-06-27
Sharon Della Libera, versione ufficiale, 2018-06-28
Sharon Della Libera, ristrutturazione file, 2018-07-29
Mirko Gibin, correzione file, 2018-07-31
Descrizione: la classe SqlFileContent implementa i metodi necessari
per generare i contenuti del file.
*/

var fileContent = require('./filecontent.js');
var fs = require('fs');

class SqlFileContent extends fileContent {
    constructor(entity) {
        super();
        this.contents = this.createContent(entity);
    }

    /* Descrizione: il metodo crea l'intestazione del file
     Parametri: entity, entità, dati necessari per generare l'intestazione.
  */
    createHeader(entity) {
        var file = fs.readFileSync("fileTemplates/sql/header.txt");
        return file.toString().replace("[NAME]", entity.name);
    }

    /* Descrizione: il metodo gestisce la creazione degli array monodimensionali.
       Ogni volta che nello switch per generare il tipo nel metodo createAttributes
       si incontra un tipo array, viene invocato questo metodo. Si occupa di chiudere
       la tabella dell'entità padre in cui compare l'array e viene generata una seconda
       tabella contenente la FOREIGN KEY collegata all'entità iniziale.
       Parametri: attribute, attributo, dati necessari per avere l'attributo da
                  promuovere a "tabella"
                  parentTab, entità, dati necessari per avere il nome dell'entità padre
    */
    sqlReferenceTable(attribute, parentTab) {
	    let type = attribute.type.replace("ArrayList<", '');
        type = type.replace('>', '');
        type = this.calculateType(type);
        var file = fs.readFileSync("fileTemplates/sql/referenceTable.txt");
        var table = file.toString();
        table = table.split("[NAME]").join(attribute.name);
        table = table.split("[PARENT]").join(parentTab.name);
        table = table.split("[TABPARENT]").join((parentTab.name).toLowerCase());
        table = table.split("[TYPE]").join(type);
        return table;
    }

    /* Descrizione: il metodo converte il tipo Java degli attributi in tipi adatti a MySQL
       Parametri: attribute, String, stringa rappresentatnte l'attributo da calcolare.
    */

    calculateType(attribute) {
        let type = "";
        switch(attribute) {
            case "String":
                type += "CHAR(255)";
                break;
            case "Integer":
            case "Double":
            case "Float":
                type += "NUMERIC(3,0)";
                break;
            case "Boolean":
                type += "BIT";
                break;
            case "Date":
                type += "DATE";
                break;
        }
        return type;
    }

    /* Descrizione: il metodo crea gli attributi del file
       Parametri: entity, entità, dati necessari per generare gli attributi.
    */
    createAttributes(entity) {
        let string="";
        let attributes = entity.attributesArray;
        let refTable = "";
        let trigger = "";
        for(let i in attributes) {
            let type = this.calculateType(attributes[i].type);
            if(type != "")
                string += ",\n\t" + attributes[i].name + " " + type;
            else {
                refTable += this.sqlReferenceTable(attributes[i], entity);
                trigger += this.createKeyTrigger(attributes[i], entity);
            }
        }
        var pos = string.lastIndexOf(',');
        string += ');\n\n';
        return string + refTable + trigger;
    }

    /*Descrizione: crea il trigger di gestione delle chiavi delle tabelle referenziate per permettere la gestione del database sia con jdbc che con hibernate
    Parametri: attr, attributo, oggetto da cui prendere il nome per assegnarlo alla tabella.
               parentTab, entità, oggetto da cui prendere il nome per assegnarlo alla chiave esterna.

     */
    createKeyTrigger(attr, parentTab) {
        var file = fs.readFileSync("fileTemplates/sql/keyTrigger.txt");
        let trigger = file.toString();
        trigger = trigger.split("[NAME]"). join(attr.name);
        trigger = trigger.split("[PARENT]").join((parentTab.name).toLowerCase());
        return trigger;
    }

       /* Descrizione: se l'entity di riferimento un singleton viene aggiunto il trigger che controlla e segnalea l'istanziazione di una nuvo record.
           Parametri: entity, entità, dati necessari per generare gli attributi.
    */
    createSingletonTrigger(entity) {
        var file = fs.readFileSync("fileTemplates/sql/singletonTrigger.txt");
        let trigger = file.toString();
        trigger = trigger.split("[NAME]").join(entity.name);
        return trigger;
    }

    /*  Descrizione: il metodo crea il contenuto del file sql richiamando i file necessari
       Parametri: entity, entità, dati per creare il contenuto
    */
    createContent(entity) {
        let singletonTrigger = "";
        if(entity.singleton === "true")
            singletonTrigger = this.createSingletonTrigger(entity);

        return this.createHeader(entity) + this.createAttributes(entity) + singletonTrigger;
    }

}
module.exports = SqlFileContent;