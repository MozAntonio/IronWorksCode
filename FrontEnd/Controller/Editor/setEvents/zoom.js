/*
File: zoom.js
Versione: 2.0
Autore: Anna Poletti;
Registro Modifiche:
Anna Poletti, creazione file, 2018-07-11
Antonio Moz , implementazione zoom, 2018-07-24
Antonio Moz, implementazione offsetLocalPoint, 2018-07-24
Antonio Moz, versione ufficiale, 2018-07-26
*/

import {editorGraph} from "../editor.js";

/* Descrizione: la funzione si occupa di rendere disponibile lo zoom sull'editor tramite la rotellina del mouse. */
export function zoom() {
    /* Imposto l'evento "mouse-wheel con scroll del mouse nel DOM" (ovvero all'uso della rotellina del mouse per
       fare scroll e non quando la si preme...)
       Tale evento è collegato solo all'oggetto "paper", ed effettua una chiamata di funzione che si occupa dello zoom
       Nota: "DOMMouseScroll" serve per la compatibilità con il browser "Mozilla Firefox"
    */
    editorGraph.paperEditor.$el.on("mousewheel DOMMouseScroll", function(event) {
        /* Resetto e reimposto l'evento originale, necessario per eseguire correttamente gli eventi "mouse-wheel" e
           "DOMMouseScroll"
        */
        event.preventDefault();
        event = event.originalEvent;

        //Variabile che definisce lo "step di zoom" ad ogni scatto della rotellina del mouse
        const step = 50;
        /* Variabile che calcola il valore corrispondente a quanto la rotellina del mouse è stata girata
           Nota: "event.wheelDelta" serve per la compatibilità con il browser "Mozilla Firefox"
        */
        const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail))) / step;

        /* Calcolo l'offset delle coordinate "X" e "Y":
           - Relativamente all'oggetto contenente il "paper";
           - Oppure calcolate come differenza fra le coordinate assolute della finestra meno le coordinate attuali
             del puntatore del mouse.
        */
        const offsetX = (event.offsetX || event.clientX - $(this).offset().left);
        const offsetY = (event.offsetY || event.clientY - $(this).offset().top);

        //Variabile del punto dello schermo indicante la nuova posizione basata sugli "offset" calcolati
        const point = offsetToLocalPoint(offsetX, offsetY);

        //Variabile contente di quanto il "paper" deve essere "scalato" (livello di zoom)
        const newScale = V(editorGraph.paperEditor.viewport).scale().sx + delta;

        //Imposto un intervallo minimo di zoom in avanti e di zoom indietro
        if(newScale > 0.4 && newScale < 2) {
            //Setto le coordinate dell'origine del "paper"
            editorGraph.paperEditor.setOrigin(0, 0);
            //Opero lo "scale" del "paper"
            editorGraph.paperEditor.scale(newScale, newScale, point.x, point.y);
        }
    });
}

/* Descrizione: la funzione riceve come parametri le coordinate di un punto, e ritorna un punto con le medesime
   coordinate "convertite per lo schermo".
   Parametri: x, integer, coordinata dell'asse delle ascisse relativa al punto;
              y, integer, coordinata dell'asse delle ordinate relativa al punto.
*/
function offsetToLocalPoint(x, y) {
    //Creo un punto con il sistema di coordinate degli SVG, basandomi sull'SVG che descrive il "paper"
    const svgPoint = editorGraph.paperEditor.svg.createSVGPoint();
    //Assegno le coordinate di "X" e "Y" ricevute come parametri
    svgPoint.x = x;
    svgPoint.y = y;

    /* Ritorno il punto con le coordinate assegnate convertendole da coordinate basate sul sistema degli SVG in
       coordinate per lo schermo
    */
    return svgPoint.matrixTransform(editorGraph.paperEditor.viewport.getCTM().inverse());
}