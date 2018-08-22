/*
File: graphelemente.js
Versione: 1.0
Autore: Anna Poletti;
Registro Modifiche:
Anna Poletti, creazione file, 2018-06-25
Anna Poletti, definizione costruttore classe,  2018-06-26
Antonio Moz, versione ufficiale, 2018-06-26
*/

import {GraphRD} from "./graph.js";
import {Actor} from "../Element/actor.js";
import {Boundary} from "../Element/boundary.js";
import {Control} from "../Element/control.js";
import {Entity} from "../Element/entity.js";

export class GraphElement extends GraphRD {
    constructor() {
        //Variabile per la creazione del diagramma relativo agli elementi
        const superObj = super();
        this.graphElement = superObj.graphRD;

        //Variabile per la creazione del foglio contenente gli elementi
        this.paperElement = new joint.dia.Paper({
            //Collego il foglio all'elemento corretto della struttura HTML, e aggiungo il diagramma correlato
            el: $("#elements"),
            model: this.graphElement,
            //Dimensioni del foglio
            width: "100%",
			height: $("#diagrams").height(),
            //Colore di sfondo del foglio
            background: {
                color: "#FFFFFF"
            },
            interactive: false
        });

        this.actor = new Actor();
        this.boundary = new Boundary();
        this.control = new Control();
        this.entity = new Entity();

        //Aggiungo gli elementi del diagramma di robustezza
        this.graphElement.addCells([this.actor.elementRD, this.boundary.elementRD, this.control.elementRD, this.entity.elementRD]);
    }
}