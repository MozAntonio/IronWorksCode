/*
File: editmenu.js
Versione: 2.0
Autore: Antonio Moz
Registro Modifiche:
Anna Poletti, creazione file, 2018-06-21
Antonio Moz, implementazione corpo funzione showMenu() , 2018-06-25
Anna Poletti, implementazione corpo funzione hideMenu(), 2018-06-25
Antonio Moz, versione ufficiale, 2018-06-26
*/


/* Descrizione: la funzione si occupa di mostrare il menù contenente gli elementi da aggiungere al diagramma. */
export function showMenu() {
    $("#menu").animate({width:290},500);
	$("#info").attr("class", "show");
    $(".showMenu").css("display", "none");
    $(".hideMenu").css("display", "block");
}

/* Descrizione: la funzione si occupa di nascondere il menù contenente gli elementi da aggiungere al diagramma. */
export function hideMenu() {
    $("#menu").animate({width:0},500);
	$("#info").attr("class", "hidden");
    $(".showMenu").css("display", "block");
    $(".hideMenu").css("display", "none");
}