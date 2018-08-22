/*
File: editlink.js
Versione: 2.0
Autore: Anna Poletti;
Registro Modifiche:
Anna Poletti, creazione file, 2018-06-21
Anna Poletti, inizializzazione variabili suppoto, 2018-07-13
Antonio Moz, aggiunta controlli collegamenti circolari, 2013-07-13
Antonio Moz, versione ufficiale, 2018-07-15
*/

import {editorGraph} from "../editor.js";

/* Descrizione: la funzione si occupa di permettere la modifica dell'elemento di partenza e/o di arrivo
   di una Linea di Associazione già presente nel diagramma per collegare altri due elementi distinti.
*/
export function editLink() {
    //Imposto una chiamata di funzione quando l'utente tenta di cambiare l'elemento di partenza e/o di arrivo
    editorGraph.graphEditor.on("change:source change:target", function(link) {
        //Inizializzo delle variabili per tenere traccia delle azioni dell'utente
		let idSourceElement = link.get("source").id;
		let idTargetElement = link.get("target").id;
		let typeSourceElement = editorGraph.graphEditor.getCell(idSourceElement).get("elementType");
		let typeTargetElement = editorGraph.graphEditor.getCell(idTargetElement).get("elementType");

        //Controllo che l'utente non tenti un collegamento circolare da un elemento allo stesso elemento
		if(idSourceElement !== idTargetElement) {
            //Se una delle regole del Robustness Diagram viene violata, lo segnalo all'utente e resetto l'azione
            if((typeSourceElement === "rd.Actor" && typeTargetElement === "rd.Actor") ||
                (typeSourceElement === "rd.Actor" && typeTargetElement === "rd.Control") ||
                (typeSourceElement === "rd.Actor" && typeTargetElement === "rd.Entity") ||
                (typeSourceElement === "rd.Boundary" && typeTargetElement === "rd.Boundary") ||
                (typeSourceElement === "rd.Boundary" && typeTargetElement === "rd.Entity") ||
                (typeSourceElement === "rd.Control" && typeTargetElement === "rd.Actor") ||
                (typeSourceElement === "rd.Entity" && typeTargetElement === "rd.Actor") ||
                (typeSourceElement === "rd.Entity" && typeTargetElement === "rd.Boundary") ||
                (typeSourceElement === "rd.Entity" && typeTargetElement === "rd.Entity")) {
					alert("The selected elements can not be linked.");
					link.set("source", {id: link.get("oldsource").id});
					link.set("target", {id: link.get("oldtarget").id});
			}
            //Effettuo la modifica alla Linea di Associazione richiesta dall'utente
			else {
				link.set("oldsource", {id: link.get("source").id});
				link.set("oldtarget", {id: link.get("target").id});
			}
		}
		else {
			alert("The element can not be linked to itself.");
			link.set("source", {id: link.get("oldsource").id});
			link.set("target", {id: link.get("oldtarget").id});
		}
	});
}