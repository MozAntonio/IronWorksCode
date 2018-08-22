/*
File: addline.js
Versione: 2.0
Autore: Anna Poletti;
Registro Modifiche:
Anna Poletti, creazione file, 2018-06-21
Antonio Moz, implementazione scheletro funzione, 2018-06-22
Antonio Moz, aggiunti controlli per evitare collegamenti anomali, 2018-06-25
Antonio Moz, versione ufficiale, 2018-06-26
*/

//implementazione corpo funzione showMenu

import {editElement} from "../setEvents/editelement.js";
import {editorGraph} from "../editor.js";

/* Descrizione: la funzione si occupa di permettere l'inserimento di una Linea di Associazione al diagramma per
   collegare due elementi distinti.
*/
export function addLine() {
    //Inizializzo delle variabili per tenere traccia delle azioni dell'utente
    let isFirstElement = true;
    let idSourceElement = null;
    let idTargetElement = null;
    let typeSourceElement = null;
    let typeTargetElement = null;
    //alert("Select the first element to link.");

    /* Aggiungo l'evento "pointerclick" all'elemento, in modo da invocare la funzione per la creazione della
       Linea di Associazione al momento opportuno
    */
    editorGraph.paperEditor.on("cell:pointerclick", function(cellView) {
        /* Se è l'elemento "source" (il primo) allora salvo i suoi dati e aspetto che l'utente scelga l'elemento
           "target" (il secondo)
        */
        if(isFirstElement) {
            idSourceElement = cellView.model.id;
            typeSourceElement = cellView.model.get("elementType");
            isFirstElement = false;
            //alert("Select the second element to link.");
        }
        /* Se è l'elemento "target" (il secondo) allora salvo i suoi dati e controllo se la Linea di
         Associazione richiesta rispetta le regole del Robustness Diagram
        */
        else {
            idTargetElement = cellView.model.id;
            typeTargetElement = cellView.model.get("elementType");

            //Controllo che l'utente non tenti un collegamento circolare da un elemento allo stesso elemento
            if(idSourceElement !== idTargetElement) {
                //Se una delle regole del Robustness Diagram viene violata, lo segnalo all'utente
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
                }
                else {
                    //Creo la Linea di Associazione che collega i due elementi validi selezionati dall'utente
                    const link = new joint.dia.Link({
                        source: {id: idSourceElement},
                        target: {id: idTargetElement},
                        oldsource: {id: idSourceElement},
                        oldtarget: {id: idTargetElement}
					});

                    //Aggiungo la Linea di Associazione al diagramma
                    link.addTo(editorGraph.graphEditor);
                }
            }
            else {
                alert("The element can not be linked to itself.");
            }

            //Reset dell'evento collegato al paper
            editorGraph.paperEditor.off();

            //Reimposto l'evento "double-clicked" standard di modifica elemento
            editElement();
        }
    });
}