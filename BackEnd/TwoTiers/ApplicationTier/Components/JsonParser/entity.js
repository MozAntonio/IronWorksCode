/*
File: entity.js
Versione: 2.0
Autore: Sharon Della Libera
Registro Modifiche:
Sharon Della Libera, creazione file, 2018-06-25
Sharon Della Libera, creazione classe Entity, 2018-06-25
Sharon Della Libera, versione ufficiale, 2018-06-28
Sharon Della Libera, aggiunto campo dati singleton, 2018-07-26
Descrizione: la classe Entity si occupa di creare un oggetto entità
costituito dal nome, dalla visibilità, dalla caratteristica singleton e dall'array di attributi.
*/

var attributeClass = require("./attribute.js");
class Entity {
    constructor(entity) {
        if(entity.access === "default")
            this.access = "";
        else
            this.access = entity.access;
        this.name = (entity.attrs.label.text).split(/[^\w\s]/).join('');
        this.name = (this.name).replace(/^[\d-]*\s*/, '');
        this.name = (this.name).substring(0, 1).toUpperCase() + (this.name).substring(1).toLowerCase();
        if((this.name).toLowerCase() == "entity")
            this.name += "E"; //evito conflitti con Entity annotation hibernate

    this.singleton = entity.singleton;
        this.attributesArray = new Array();
        while(entity.attributes.length > 0) {
            var attribute = entity.attributes.shift();
            this.attributesArray.push(new attributeClass(attribute));
        }
    }
}

module.exports = Entity;