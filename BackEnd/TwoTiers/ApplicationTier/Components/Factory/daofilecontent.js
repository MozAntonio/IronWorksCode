/*
File: daofilecontent.js
Versione: 3.0
Autore: Mirko Gibin
Registro Modifiche:
Mirko Gibin, creazione file, 2018-07-26
Mirko Gibin, stesura file, 2018-07-26
Mirko Gibin, restrutturazione file, 2018-07-28
Sharon Della Libera, correzione file,  2018-07-29
Descrizione: la classe DaoFileContent implementa i metodi necessari
per generare i contenuti del file per l'interazione con il database e
la persistenza dei dati
*/

var fileContent = require('./filecontent.js');
var fs = require('fs');

class DaoFileContent extends fileContent {
    constructor(entity) {
        super();
        this.contents = this.createContent(entity);
    }

    /* Descrizione: il metodo crea l'intestazione del file
      Parametri: entity, entità, dati necessari per generare l'intestazione.
   */
    createHeader(entity) {
        var head = fs.readFileSync("fileTemplates/jdbc/header.txt");
        var string = head.toString();
        string = string.split("[CLASSNAME]").join(entity.name);
        return string;
    }
    /* Descrizione: il metodo genera il metodo java per gestire la create delle operazioni CRUD
       Parametri: entity, entità, entità su cui eseguire la query e il relativo metodo
    */
    createMethod(entity) {
        let file = fs.readFileSync("fileTemplates/jdbc/create.txt");
        var method = file.toString();
        var attributes = "";
        var settings = "";
        var param = "";
        var sqladd = "";
        var fields = "db_id = db_id, ";
        var paramSettings = "";
        var a = entity.attributesArray;
        var paramField = a.length;
        var x = 1;
        for(var i in a) {
            if (this.isArray(a[i].type)) {
                sqladd += "sqlAdd[ATTRIBUTE]([INSTANCENAME], conn);\n\t\t\t\t";
                sqladd = sqladd.replace("[ATTRIBUTE]", (a[i].name));
            } else {
                attributes += ", "+a[i].name;
                param += ", ?";
                x++;
                settings += this.setSettings(x, a[i]);
               // if (i != 0) {
                    fields += a[i].name + "= ?, ";
                    paramSettings += this.setSettings("[o]", a[i]);
                //}
            }
        }
        for(var i = 0; i < x; i++)
            paramSettings = paramSettings.replace("[o]", x+i+1);

        //attributes = attributes.substring(0, attributes.length - 2);
        method = method.replace("[ATTRIBUTESLIST]", attributes);
        //param = param.substring(0, param.length - 2);
        fields = fields.substring(0, fields.length - 2);
        method = method.replace("[PARAM]", param);
        method = method.replace("[FIELDS]", fields);
        method = method.replace("[SETTINGS]", settings + paramSettings);
        method = method.replace("[SQLADDARRAY]", sqladd);

        return method +"\n";
    }

    /* Descrizione: il metodo genera il metodo java per gestire la read delle operazioni CRUD
       Parametri: entity, entità, entità su cui eseguire la query e il relativo metodo
    */
    readMethod(entity) {
        let file = fs.readFileSync("fileTemplates/jdbc/read.txt");
        var method = file.toString();
        var settings = "";
        var setArray = "";
        var a = entity.attributesArray;
        var x = 1;
        for (var i in a) {
            if(this.isArray(a[i].type)) {
                setArray += "[INSTANCENAME].set[ATT](read[ATT]([INSTANCENAME].getDb_id(), conn));\n\t\t\t\t\t";
                setArray = setArray.split("[ATT]").join(a[i].name);
            }
            else {
                x += 1;
                settings += "[INSTANCENAME].set[ATT](result.get[TYPE](" + x + "));\n\t\t\t\t\t";
                settings = settings.replace("[TYPE]", a[i].type);
                settings = settings.replace("Integer", "Int");
                settings = settings.replace("[ATT]", a[i].name);
            }
        }
        method = method.split("[SETTINGS]").join(settings);
        method = method.split("[SQLSETARRAY]").join(setArray);
        return method + "\n";
    }

    /* Descrizione: il metodo genera il metodo java per gestire la delete delle operazioni CRUD
       Parametri: entity, entità, entità su cui eseguire la query e il relativo metodo
    */
    deleteMethod(entity) {
        let file = fs.readFileSync("fileTemplates/jdbc/delete.txt");
        var method = file.toString();
        var a = entity.attributesArray;
        var deleteArray = "";
        for (var i in a) {
            if (this.isArray(a[i].type)) {
                deleteArray += "deleteFrom[ARRAYNAME]([INSTANCENAME].getDb_id(), conn);\n\t\t\t";
                deleteArray = deleteArray.replace("[ARRAYNAME]", a[i].name);
            }
        }
        method = method.split("[SQLDELETEARRAY]").join(deleteArray);
        return method + "\n";
    }

    /* Descrizione: il metodo genera il metodo java per gestire la delete degli array
       Parametri: entity, entità, entità su cui eseguire la query e il relativo metodo
    */
    deleteFromArray(entity) {
        let file = fs.readFileSync("fileTemplates/jdbc/deleteFromArray.txt");
        var string = file.toString();
        var method = "";
        var a = entity.attributesArray;
        for (var i in a) {
            if (this.isArray(a[i].type)) {
                method += string;
                method = method.split("[NAMEARRAY]").join((a[i].name));
            }
        }
        return method + "\n";
    }

    /* Descrizione: il metodo calcola il tipo di un attributo array
       Parametri: type, stringa, stringa che identifica il tipo dell'attributo
    */
    calculateType(type) {
        type = type.split("ArrayList<").join("");
        type = type.split(">").join("");
        type = type.split("Integer").join("Int");
        return type;
    }
    /* Descrizione: il metodo imposta i setter deglis statement
    Parametri:  a, attributo, contiene nome e tipo di un attributo
                i, intero, indice che indica la posizione del parametro dello statement
     */
    setSettings(i, a) {
        var settings = "";
        settings += "statement.set[TIPO]([INDEX], [INSTANCENAME].get[ATTRIBUTE]()[IFDATE]);\n\t\t\t";
        if(a.type == "Date"){
            settings = settings.replace("[INSTANCENAME]","new java.sql.Date([INSTANCENAME]");
            settings = settings.replace("[IFDATE]", ".getTime())");
        }
        else
            settings = settings.replace("[IFDATE]", "");
        settings = settings.replace("[TIPO]", a.type);
        settings = settings.replace("[INDEX]", i);
        settings = settings.replace("[ATTRIBUTE]", a.name);
        settings = settings.replace("Integer", "Int");
        return settings;
    }

    /* Descrizione: il metodo genera il metodo java per gestire l'aggiunta degli elementi agli array
       Parametri: entity, entità, entità su cui eseguire la query e il relativo metodo
    */
    addArray(entity) {
        let file = fs.readFileSync("fileTemplates/jdbc/addArray.txt");
        var method = "";
        var string = file.toString();
        var a = entity.attributesArray;
        for (var i in a) {
            if(this.isArray(a[i].type)) {
                method += string;
                method = method.split("[TIPO]").join(this.calculateType(a[i].type));
                method = method.replace("[ARRAYTYPE]", a[i].type);
                method = method.split("[ARRAYNAME]").join(a[i].name);
                if(this.calculateType(a[i].type) === "Date")
                    method = method.split("[ATTRIBUTE]").join("new java.sql.Date(x.getTime())");
                else
                    method = method.split("[ATTRIBUTE]").join("x");
            }
        }
        method = method.replace("Int x", "Integer x");
        return method;
    }

    /* Descrizione: il metodo calcola la luunghezza degli array
       Parametri: entity, entità, entità su cui eseguire la query e il relativo metodo
    */
    tableArrayLength(entity) {
        let file = fs.readFileSync("fileTemplates/jdbc/tableArrayLength.txt");
        var method = "";
        var string = file.toString();
        var a = entity.attributesArray;
        for (var i in a) {
            if(this.isArray(a[i].type)) {
                method += string;
                method = method.split("[ARRAYNAME]").join(a[i].name);
            }
        }
        method = method.replace("[INSTANCENAME]", entity.name);
        return method;
    }

    /* Descrizione: il metodo genera il metodo java per leggere gli array
       Parametri: entity, entità, entità su cui eseguire la query e il relativo metodo
    */
    readArray(entity) {
        let file = fs.readFileSync("fileTemplates/jdbc/readArray.txt");
        var method = "";
        var string = file.toString();
        var a = entity.attributesArray;
        for (var i in a) {
            if(this.isArray(a[i].type)) {
                method += string;
                method =  method = method.split("[ARRAYNAME]").join(a[i].name);
                method = method.split("[TIPO]").join(this.calculateType(a[i].type));
                method = method.split("[ARRAYTYPE]").join(a[i].type);
            }
        }
        return method;
    }

    /* Descrizione: il metodo calcola l'indice univoco cercando l'ultimo ID inserito nel database
       Parametri: entity, entità, entità su cui eseguire la query e il relativo metodo
    */
    lastID(entity){
        let file = fs.readFileSync("fileTemplates/jdbc/lastId.txt");
        var method = file.toString();
        return method;
    }

    /* Descrizione: il metodo verifica se l'attributo è o meno un array
       Parametri: type, stringa, stringa che identifica il tipo dell'attributo
    */
    isArray(type) {
        if(type.lastIndexOf(">") == -1)
            return false;
        else
            return true;
    }

    /*  Descrizione: il metodo costruisce il contenuto del file chiamando gli altri metodi
        Paramentri: entity, entità, dati necessari per generare i contenuti
     */
    createContent(entity) {
        var content = this.createHeader(entity)
            + this.createMethod(entity)
            + this.readMethod(entity)
            + this.deleteMethod(entity)
            + this.deleteFromArray(entity)
            + this.addArray(entity)
            + this.tableArrayLength(entity)
            + this.readArray(entity)
            + this.lastID(entity)
            +"\n}";
        if(entity.singleton == "true")
            content = content.split("new [CLASSNAME]()").join("[CLASSNAME].getInstance()");
        content = content.split("[INSTANCENAME]").join(entity.name.toLowerCase());
        content = content.split("[CLASSNAME]").join(entity.name);

        return content;
    }
}

module.exports = DaoFileContent;