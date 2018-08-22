/*
File: attribute.js
Versione: 2.0
Autore: Sharon Della Libera
Registro Modifiche:
Sharon Della Libera, creazione file, 2018-06-25
Sharon Della Libera, creazione classe Attribute, 2018-06-25
Sharon Della Libera, versione ufficiale, 2018-06-28
Sharon Della Libera, sistemazione tipo array, 2018-07-26
Descrizione: la classe Attribute si occupa di creare un oggetto "attributo"
composto dal nome, dalla visibilità e dal tipo
*/

class Attribute {
    constructor(attributes) {
        if(attributes.access === "default")
            this.access = "";
        else
            this.access = attributes.access;
        this.name = (attributes.name).split(/[^\w\s]/).join('');
        this.name = (this.name).replace(/^[\d-]*\s*/, '');
        this.type = attributes.type;
        if(this.type.lastIndexOf("Array") != -1)
            this.type = this.type.replace("ArrayList", "ArrayList<") + ">";
    }
}

module.exports = Attribute;