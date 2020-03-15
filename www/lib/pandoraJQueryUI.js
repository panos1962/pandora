///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// javascipt
// @FILETYPE END
//
// @FILE BEGIN
// www/lib/pandoraJQueryUI.js —— JavaScript client module για web εφαρμογές
// που χρησιμοποιούν το UI jQuery module.
// @FILE END
//
// @HISTORY BEGIN
// Created: 2020-01-20
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";
module.exports = function(pd) {

///////////////////////////////////////////////////////////////////////////////@

// Greek (el) initialisation for the jQuery UI date picker plugin.
// Written by Alex Cicovic (http://www.alexcicovic.com)

$.datepicker.setDefaults({
	'closeText': "Κλείσιμο",
	'prevText': "Προηγούμενος",
	'nextText': "Επόμενος",
	'currentText': "Σήμερα",
	'monthNames': [ "Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος",
		"Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος",
		"Νοέμβριος","Δεκέμβριος" ],
	'monthNamesShort': [ "Ιαν","Φεβ","Μαρ","Απρ","Μαι","Ιουν","Ιουλ","Αυγ",
		"Σεπ","Οκτ","Νοε","Δεκ" ],
	'dayNames': [ "Κυριακή","Δευτέρα","Τρίτη","Τετάρτη","Πέμπτη",
		"Παρασκευή","Σάββατο" ],
	'dayNamesShort': [ "Κυρ","Δευ","Τρι","Τετ","Πεμ","Παρ","Σαβ" ],
	'dayNamesMin': [ "Κυ","Δε","Τρ","Τε","Πε","Πα","Σα" ],
	'weekHeader': "Εβδ",
	'firstDay': 1,
	'isRTL': false,
	'showMonthAfterYear': false,
	'yearSuffix': "",
	'dateFormat': "dd-mm-yy",
});

///////////////////////////////////////////////////////////////////////////////@

};
