/*
File: savediagram.js
Versione: 1.0
Autore: Antonio Moz
Registro Modifiche:
Anna Poletti, creazione file, 2018-06-21
Antonio Moz, implementazione corpo funzione, 2018-06-25
Antonio Moz, versione ufficiale, 2018-06-26
*/

import {editorGraph} from "../editor.js";

/* Descrizione: la funzione si occupa di salvare in locale un file JSON contenente i dati del diagramma corrente. */
export function saveDiagram() {
    //Aggiungo al diagramma la data attuale di esportazione
    editorGraph.graphEditor.set("graphExportTime", Date.now());

    //Genero il file Object-JSON e lo converto in String-JSON
    const jsonObject = editorGraph.graphEditor.toJSON();
    const jsonString = JSON.stringify(jsonObject, null, 2);

    //Creo un Blob contenente il JSON, ed un URL che punti ad esso
    const blob = new Blob([jsonString], {type: 'application/json'});
    const url = window.URL.createObjectURL(blob);

    //Creo un tag HTML "<a>" per il download del file JSON
    const a = document.createElement("a");
    $("body").append(a);
    //TODO: Aggiungere style tramite CSS
    a.style = "display: none;";
    a.href = url;
    a.download = localStorage.getItem("projectName") + ".json";
    a.click();

    //Dopo il download rimuovo ciò che ho creato
    window.URL.revokeObjectURL(url);
    a.remove();
}