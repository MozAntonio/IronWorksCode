/*
File: jsonparser.js
Versione: 1.0
Autore: Mirko Gibin
Registro Modifiche:
Mirko Gibin, creazione file, 2018-06-25
Mirko Gibin, creazione classe JsonParser, 2018-06-25
Mirko Gibin, versione ufficiale, 2018-06-28
Descrizione: la classe è definita come singeton; riceve il file JSON
parsato (jsonObject) e salva nel suo campo dati un array composto dalle entità
presenti nel file. Ciò permette di utilizzare un array strutturato per
accedere alle entità al posto di eseguire ogni volta il parse del file.
*/

var entityClass = require("./entity.js");

class jsonParser {
    //costruttore della classe singleton, genera un'unica istanza della classe
    constructor(jsonObject) {
        //campo dati
        jsonParser.entityArray = new Array();
        //crea le entità analizzando l'oggetto jsonObject
        while(jsonObject.cells.length > 0) {
            var entity = jsonObject.cells.shift();
            if(entity.type !== undefined && entity.elementType === "rd.Entity")
                jsonParser.entityArray.push(new entityClass(entity))
        }

        return jsonParser.entityArray;
    };
}

module.exports = jsonParser;