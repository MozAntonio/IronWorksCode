/*
File: ssenddata.js
Versione: 1.0
Autore: Antonio Moz
Registro Modifiche:
Anna Poletti, creazione file, 2018-06-21
Antonio Moz, implementazione corpo funzione, 2018-06-25
Antonio Moz, versione ufficiale, 2018-06-26
*/
import {editorGraph} from "../editor.js";

/* Descrizione: la funzione si occupa di inviare un JSON al back-end contentente il diagramma corrente
   al fine di generare il codice associato ad esso.
*/
export function sendData() {
    /* Se sono presenti elementi isolati (non collegati da alcuna Linea di Associazione)
       segnalo l'errore all'utente e non richiedo la generazione del codice al back-end
    */
    let notLinked = false;
    _.each(editorGraph.graphEditor.getElements(), function(element) {
        const linked = editorGraph.graphEditor.getConnectedLinks(element);

        if(String(linked) === "")
            notLinked = true;
    });

    //Sono presenti elementi isolati
    if(notLinked) {
        alert("It's not possible to generate the code because there are isolated elements in the diagram.");
    }
    //Non sono presenti elementi isolati e quindi si può procede con la generazione del codice
    else {
        const request = new XMLHttpRequest();
        request.open("POST", "/code", true);
        request.setRequestHeader("Content-Type", "application/json");

        //Funzione di supporto che comunica con il back-end
        request.onreadystatechange = function () {
            //Solo se è andato tutto a buon fine, procedo con lo scaricamento dello ZIP contente il codice generato
            if(request.readyState === 4 && request.status === 200) {
                const blob = new Blob([request.response], {type: "application/zip"});
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");

                $("body").append(a);
                //TODO: Aggiungere style tramite CSS
                a.style = "display: none;";
                a.href = url;
                a.download = localStorage.getItem("projectName") + ".zip";
                a.click();

                window.URL.revokeObjectURL(url);
                a.remove();
            }
        };

        //Preparo il JSON e lo invio al back-end
        const data = JSON.stringify(editorGraph.graphEditor.toJSON());
        request.responseType = "arraybuffer";
        request.send(data);
    }
}