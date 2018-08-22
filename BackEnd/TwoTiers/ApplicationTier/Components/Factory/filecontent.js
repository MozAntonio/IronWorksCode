/*
File: filecontent.js
Versione: 1.0
Autore: Mirko Gibin
Registro Modifiche:
Mirko Gibin, creazione file, 2018-06-27
Mirko Gibin, creazione classe JavaFile, 2018-06-27
Mirko Gibin, versione ufficiale, 2018-06-28
Sharon Della Libera, rimozione template method, 2018-07-26
Descrizione: la classe FileContent è la classe base che gestisce
crea i contenuti del file.
*/

class FileContent {
    constructor() {
        this.contents = "";
    }
    createContent(entity) {}
}

module.exports = FileContent;