
/*
File:editor.js
Versione: 1.0
Autore: Anna Poletti;
Registro Modifiche:
Anna Poletti, aggiunta eventi on-click, 2018-06-25
Anna Poletti, definizione funzione stopWorking e goBackHome,   2018-06-26
Antonio Moz, versione ufficiale, 2018-06-26
*/

import {GraphElement} from "../../Model/Editor/scripts/Graph/graphelement.js";
import {GraphEditor} from "../../Model/Editor/scripts/Graph/grapheditor.js";
export const elementsGraph = new GraphElement();
export const editorGraph = new GraphEditor();

import {dragAndDrop} from "./setEvents/draganddrop.js";
import {editElement} from "./setEvents/editelement.js";
import {editLink} from "./setEvents/editlink.js";
import {zoom} from "./setEvents/zoom.js";

import {addLine} from "./functionsCalled/addline.js";
import {showMenu} from "./functionsCalled/editmenu.js";
import {hideMenu} from "./functionsCalled/editmenu.js";
import {saveDiagram} from "./functionsCalled/savediagram.js";
import {sendData} from "./functionsCalled/senddata.js";
import {closeEditTile} from "./setEvents/editelement.js";
import {removeElement} from "./setEvents/editelement.js";

/* Al caricamento della pagina dell'editor preparo tutte le funzionalità offerte da IronWorks. */
$(document).ready(function() {
    //Event for refresh, close tab/browser and insert new URL:
    window.onbeforeunload = stopWorking;

    //Add events "onclick":
	$(".showMenu").click(function() {
        showMenu();
    });
	$(".hideMenu").click(function() {
        hideMenu();
    });
    $("#addLineButton").click(function() {
        addLine();
    });
    $(".homeButton").click(function() {
        goBackHomePage();
    });
    $(".saveButton").click(function() {
        saveDiagram();
    });
    $(".codeButton").click(function() {
        sendData();
    });
    $("#closeEditButton").click(function() {
        closeEditTile();
    });
    $("#removeElementButton").click(function() {
        removeElement();
    });

    //Other events:
    dragAndDrop();
    editElement();
	editLink();
    zoom();

    //Imposto il titolo in base al nome del progetto
    $("title")[0].textContent = localStorage.getItem("projectName") + " - IronWorks";
    $("#title h1")[0].textContent = localStorage.getItem("projectName") + " - IronWorks";

    //Se ho caricato un vecchio progetto lo converto in un "Object-JSON" ed aggiorno l'editor
    if(localStorage.getItem("projectObject")) {
        editorGraph.graphEditor.fromJSON(JSON.parse(localStorage.getItem("projectObject")));
    }
	
	//Imposto il color picker per la selezione del colore degli elementi
	$(".colorPicker").spectrum({
		color: "#000",
		showInput: false,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxSelectionSize: 10,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
});

/* Descrizione: la funzione si occupa di effettuare un reset del contenuto dell'editor. */
function stopWorking() {
    //localStorage.removeItem("projectName");
    localStorage.removeItem("projectObject");

    //return "Are you sure?";
}

/* Descrizione: la funzione si occupa di rimandare l'utente alla pagina iniziale di IronWorks. */
function goBackHomePage() {
    if(confirm("Are you sure you want to go back to HomePage?\nIf you confirm, you'll lose all your work done.")) {
        localStorage.removeItem("projectName");
        localStorage.removeItem("projectObject");

        window.location = "../FirstPages/HomePage/homepage.html";
    }
}