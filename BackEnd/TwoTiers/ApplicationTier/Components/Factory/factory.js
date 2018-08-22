/*
File: factory.js
Versione: 1.0
Autore: Mirko Gibin
Registro Modifiche:
Mirko Gibin, creazione file, 2018-06-25
Mirko Gibin, creazione classe Factory, 2018-06-26
Mirko Gibin, versione ufficiale, 2018-06-28
Descrizione: la classe Factory è la classe base che consente
l'implementazione del patter abstract factory.
Ogni factory concreta che la implementa eredita il campo dati file,
ovvero l'array di file che la factory deve costruire. Per generare
l'array, è necessario creare i file e i contenuti dei file,
che costituiscono i prodotti dell'abstract factory.
*/

class Factory {
    constructor(){}
    /* Descrizione: il metodo crea il file che ospiterà il codice.
       Parametri: fileName, stringa, nome del file da creare.
    */
    createFile(fileName){};
    /* Descrizione: il metodo crea il codice da inserire nel file.
       Parametri: entity, entità, l'entità da utilizzare per generare i contenuti.
    */
    createContent(entity){};
}
module.exports=Factory;