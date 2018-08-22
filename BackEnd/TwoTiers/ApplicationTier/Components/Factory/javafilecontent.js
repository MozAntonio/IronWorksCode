/*
File: javafilecontent.js
Versione: 2.0
Autore: Mirko Gibin
Registro Modifiche:
Mirko Gibin, creazione file, 2018-06-27
Mirko Gibin, creazione classe javafilecontent, 2018-06-27
Mirko Gibin, versione ufficiale, 2018-06-28
Mirko Gibin, aggiunta del campo dati per
             hibernate, 2018-07-30
Mirko Gibin, restrutturazione codice, 2018-07-30
Sharon Della Libera, corrrezione codice, 2018-07-31
Descrizione: la classe JavaFileContent implementa i metodi necessari
per generare i contenuti del file.
*/

var fileContent = require('./filecontent.js');
var fs = require("fs");
class JavaFileContent extends fileContent {
    constructor(entity) {
        super();
        this.contentJava = this.createContent(entity);
        this.contentHib = this.createHibernateContent(entity);
    }

    /* Descrizione: il metodo crea l'intestazione del file
      Parametri: entity, entità, dati necessari per generare l'intestazione.
   */
    buildHeader(entity, StringHead) {
        var stringSingleton = "";
        if(entity.singleton === "true") {
            var singleton = fs.readFileSync("fileTemplates/entity/singleton.txt");
            stringSingleton = singleton.toString();
        }
        return (StringHead + stringSingleton).split("[CLASSNAME]").join(entity.name);
    }

    createHeader(entity) {
        var head = fs.readFileSync("fileTemplates/entity/header.txt");
        return this.buildHeader(entity, head.toString());
    }


    createHibernateHeader(entity) {
        var head = fs.readFileSync("fileTemplates/hibernate/headerEntity.txt");
        return this.buildHeader(entity, head.toString());
    }

    createConstructor(type) {
        var t = "";
        switch (type) {
            case "Integer":
                t += "0";
                break;
            case "Float":
                t += "0f";
                break;
            case "Double":
                t += "0.0";
                break;
            case "Boolean":
                t += "false";
                break;
            case "Date" :
                t += "new Date()";
                break;
            case "String" :
                t += "new String()";
                break;

        }
        return t;
    }

    /* Descrizione: il metodo crea gli attributi del file
       Parametri: entity, entità, dati necessari per generare gli attributi.
    */
    createAttributes(entity) {
        /*aggiunge il campo dati id per identificare univocamente l'oggetto e
          inserisce il metodo per la connessione al database*/
        let string = "/*ATTRIBUTES*/\n" +
            "\tprivate int db_id;\n";
        let a = entity.attributesArray;
        for (var i in a) {
            string += "\t" + a[i].access + " " + a[i].type + " " + a[i].name + " = [CONSTRUCTOR]";
            if(a[i].type.lastIndexOf("<") != -1)
                string = string.split("[CONSTRUCTOR]").join("new ArrayList<>()");
            string = string.split("[CONSTRUCTOR]").join(this.createConstructor(a[i].type));
            string += ";\n";
        }
        return string;
    }

    createHibernateAttributes(entity) {
        let string = "/*ATTRIBUTES*/\n" +
            "\t@Id\n" +
            "\t@Column(name = \"db_id\")\n" +
            "\tprivate int db_id;\n";
        let a = entity.attributesArray;
        for (var i in a){
            if(a[i].type.lastIndexOf("<") != -1) {
                string += "\t@LazyCollection(LazyCollectionOption.FALSE)\n" +
                    "\t@ElementCollection\n" +
                    "\t@CollectionTable(name = \"[A]Array\", joinColumns=@JoinColumn(name=\"[ENTITY]id\"))\n" +
                    "\t@Column(name = \"element\")";
                string = string.split("[ENTITY]").join((entity.name).toLowerCase());
            }
            else
                string += "\t@Column (name = \"[A]\")\n";
            string = string.replace("[A]", a[i].name);
            string += "\t" + a[i].access + " " + (a[i].type).replace("Array", "") + " " + a[i].name + " = [CONSTRUCTOR]";
            if(a[i].type.lastIndexOf("<") != -1)
                string = string.split("[CONSTRUCTOR]").join("new ArrayList<>()");
            string = string.split("[CONSTRUCTOR]").join(this.createConstructor(a[i].type));

            string += ";\n";
        }
        return string;
    }

    /* Descrizione: il metodo genera il metodo get per l'attributo.
       Parametri: name, string, nome dell'attributo
                  type, string, tipo dell'attributo.
   */
    getMethods (name, type){
        var method = "\tpublic [TYPE] get[NAME]() { return [NAME]; }\n";
        if(type.lastIndexOf("<") != -1)
            method = method.split("return [NAME]"). join("return new [TYPE]([NAME])");
        method = method.split("[TYPE]").join(type);
        method = method.split("[NAME]").join(name);
        return method;
    }

    /* Descrizione: il metodo genera il metodo set per l'attributo.
       Parametri: name, string, nome dell'attributo
                  type, string, tipo dell'attributo.
   */
    setMethods(name, type){
        var method = "\tpublic void set[NAME]([TYPE] val) { [NAME] = val; }\n";
        method = method.split("[TYPE]").join(type);
        method = method.split("[NAME]").join(name);
        return method;
    }

    /*  Descrizione: il metodo genera i metodi di funzionalità sugli array
        Parametri:  name, string, nome dell'attributo
                    type, string, tipo dell'attributo
     */
    arrayUtilityMethods(name, type) {
        var t = type.replace("ArrayList<", '');
        t = t.replace('>', '');
        var file = fs.readFileSync("fileTemplates/entity/arrayUtility.txt");
        var methods = file.toString();
        methods = methods.split("[TYPE]").join(t);
        methods = methods.split("[NAME]").join(name);
        return methods;
    }

    /*  Descrizione: il metodo costruisce il contenuto del file chiamando gli altri metodi
        Paramentri: entity, entità, dati necessari per generare i contenuti
     */
    createCommonContent(entity) {
        var get = "/*GETTERS*/\n\tpublic int getDb_id() { return db_id; }\n";
        var set = "/*SETTERS*/\n \tpublic void setDb_id(int val) { db_id = val; }\n";
        var utility = "/*ARRAY UTILITIES*/\n";
        var attributes = entity.attributesArray;
        for(var x in attributes) {
            get += this.getMethods(attributes[x].name, attributes[x].type);
            set += this.setMethods(attributes[x].name, attributes[x].type);
            if(attributes[x].type.lastIndexOf(">") != -1) {
                utility += this.arrayUtilityMethods(attributes[x].name, attributes[x].type);
            }
        }
        return get + set + utility;
    }

    createContent(entity) {

        return this.createHeader(entity) + this.createAttributes(entity) + this.createCommonContent(entity) + "}";
    }

    createHibernateContent(entity) {
        return this.createHibernateHeader(entity) + this.createHibernateAttributes(entity) + this.createCommonContent(entity) + "}";
    }
}

module.exports = JavaFileContent;