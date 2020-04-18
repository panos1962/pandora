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
// lib/pandoraClient.js —— JavaScript client module για χρήση σε web εφαρμογές
// μέσω του browser.
// @FILE END
//
// @HISTORY BEGIN
// Updated: 2020-02-10
// Updated: 2020-02-05
// Updated: 2020-02-04
// Updated: 2020-01-17
// Updated: 2020-01-12
// Updated: 2020-01-11
// Updated: 2020-01-06
// Updated: 2019-12-25
// Updated: 2019-12-24
// Updated: 2019-12-21
// Updated: 2019-12-20
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd = require('../lib/pandoraCore.js');
module.exports = pd;

pd.testClient = (msg) => {
	pd.testCore('Greetings from client!');

	if (msg === undefined)
	msg = 'Hi there!';

	console.log('pandora: [testClient]: ' + msg);
};

///////////////////////////////////////////////////////////////////////////////@

// Οι functions που ακολουθούν αφορούν κυρίως σε PHP superglobals που έχουν
// εισαχθεί στο περιβάλλον της JavaScript μέσω της function "import_php" του
// sigleton "Pandora".
//
// Σημαντικό
// ‾‾‾‾‾‾‾‾‾
// Το superglobal "_REQUEST" δεν μεταφέρεται από την "import_php" και
// οποιαδήποτε αναφορά σε αυτό μεταφράζεται σε αναφορά στα superglobals
// "_POST" και "_GET" με αυτή τη σειρά.

// Οι functions "isXXX" δέχονται ως παράμετρο ένα string και επιστρέφουν true
// εφόσον το συγκεκριμένο string υφίσταται ως index στον σχερικό array, αλλιώς
// επιστρέφουν false.

php.isServer = (key) => (php._SERVER && php._SERVER.hasOwnProperty(key));
php.isSession = (key) => (php._SESSION && php._SESSION.hasOwnProperty(key));
php.isGet = (key) => (php._GET && php._GET.hasOwnProperty(key));
php.isPost = (key) => (php._POST && php._POST.hasOwnProperty(key));
php.isRequest = (key) => (php.isPost(key) || php.isGet(key));

php.noServer = (key) => !php.isServer(key);
php.noSession = (key) => !php.isSession(key);
php.noGet = (key) => !php.isGet(key);
php.noPost = (key) => !php.isPost(key);
php.noRequest = (key) => !php.isRequest(key);

// Οι functions "xxxGet" δέχονται ως πρώτη παράμετρο ένα string και εφόσον
// το συγκεκριμένο string υφίσταται ως index στο σχετικό array, επιστρέφουν
// την τιμή του αντίστοιχου στοιχείου, αλλιώς επιστρέφουν την τιμή που
// ενδεχομένως έχουμε περάσει ως δεύτερη παράμετρο.

php.serverGet = (key, val) => (php.isServer(key) ? php._SERVER[key] : val);
php.sessionGet = (key, val) => (php.isSession(key) ? php._SESSION[key] : val);
php.getGet = (key, val) => (php.isGet(key) ? php._GET[key] : val);
php.postGet = (key, val) => (php.isPost(key) ? php._POST[key] : val);
php.requestGet = (key, val) => (php.postGet(key, php.getGet(key, val)));

// Η function "_avalIsYes" δεν διατίθεται για απευθείας χρήση, αλλά παρέχεται
// κυρίως ως εργαλείο για τις functions "xxxIsYes" που ακολουθούν.

php._avalIsYes = (key, arr) => {
	if (arr === undefined)
	return false;

	try {
		if (!arr.hasOwnProperty(key))
		return false;
	}

	catch (e) {
		return false;
	}

	try {
		let val = arr[key].toUpperCase();

		if (val.match(/^[0-9]+$/))
		return parseInt(val);

		switch (val) {
		case 'OFF':
		case 'NO':
			return false;
		}

		return true;
	}

	catch (e) {
		return false;
	}
};

// Σκοπός των functions που ακολουθούν είναι να ελεγχθούν παράμετροι που έχουν
// καθοριστεί στο query string του URL. Πιο συγκεκριμένα, οι εν λόγω functions
// δέχονται το όνομα μιας παραμέτρου και επιστρέφουν true εφόσον η συγκεκριμένη
// παράμετρος περιέχεται στο query string του URL και η τιμή της παραμέτρου δεν
// είναι "0", "no" ή "off" (case insensitive).

php.getIsYes = (key) => php._avalIsYes(key, php._GET);
php.postIsYes = (key) => php._avalIsYes(key, php._POST);
php.requestIsYes = (key) => (php.postIsYes(key) ? true : php.getIsYes(key));

///////////////////////////////////////////////////////////////////////////////@

pd.isXristis = () => php.sessionGet(php.defs['PANDORA_SESSION_XRISTIS']);
pd.noXristis = () => !pd.isXristis();

pd.keepAliveTimer = undefined;

pd.keepAlive = (pandoraDir) => {
	if (typeof(pandoraDir) !== 'string') {
		if (!pd.keepAliveTimer)
		return pd;

		clearInterval(pd.keepAliveTimer);
		pd.keepAliveTimer = undefined;
		return pd;
	}

	pd.keepAliveTimer = setInterval(() => {
		$.post({
			'url': pandoraDir + '/lib/keep_alive.php',
		});
	}, 60000);

	return pd;
};

///////////////////////////////////////////////////////////////////////////////@

// Η δομή "css" περιέχει συντομεύσεις στιλιστικών προδιαγραφών γενικής χρήσης
// ομαδοποιημένες σε βολικές κατηγορίες.

pd.css = {
	// Η κατηγορία "karta" βοηθάει στην εμφάνιση εγγραφών (records)
	// σε μορφή καρτέλας.

	'karta': {
		'box': 'pnd-karta',	// περίγραμμα καρτέλας
		'row': 'pnd-kartaRow',	// γραμμή πεδίου
		'sec': 'pnd-kartaSec',	// δευτερεύον πεδίο
		'col': 'pnd-kartaCol',	// όνομα πεδίου
		'val': 'pnd-kartaVal',	// τιμή πεδίου
	},

	// Η κατηγορία "grami" βοηθάει στην εμφάνιση εγγραφών (records)
	// σε μορφή γραμμής.

	'grami': {
		'row': 'pnd-grami',	// γραμμή εγγραφής
		'val': 'pnd-gramiVal',	// τιμή πεδίου
	},
};

pd.kartaColDOM = function(col, val, css) {
	let dom;
	let colCell;
	let valCell;

	dom = $('<tr>').addClass(css.row).
	append(colCell = $('<td>')).
	append(valCell = $('<td>'));

	switch (typeof(val)) {
	case 'date':
		val = pd.date(undefined, '%M-%D-%Y');
	case 'string':
	case 'number':
		if (col !== undefined)
		colCell.addClass(css['col']).text(col);

		valCell.addClass(css['val']).text(val);
		return dom;
	case 'object':
		break;
	default:
		if (col !== undefined)
		colCell.addClass(css['col']).text(col);

		valCell.addClass(css['val']).text('??????');
		return dom;
	}

	if (Array.isArray(val))
	pd.arrayWalk(val, (v) => {
		valCell.append(pd.kartaDOM(v, css));
	});

	else
	valCell.append(pd.kartaDOM(val));

	return dom;
};

pd.kartaDOM = function(obj) {
	let cols = Object.keys(obj);
	let css = pd.css.karta;
	let dom = $('<div>').addClass(css.box);
	let data = $('<table>').appendTo(dom);

	for (let i = 0; i < cols.length; i++)
	data.append(pd.kartaColDOM(cols[i], obj[cols[i]], css));

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@

pd.readyCount = 0;

pd.ready = () => {
	pd.readyCount++;

	if (pd.readyCount < 2)
	return pd;

	pd.windowDOM = $(window);
	pd.bodyDOM = $(document.body);

	if (pd.init)
	pd.init();

	return pd;
};

pd.domInit = (init) => {
	pd.init = init;
	$(window).ready(pd.ready);
	$(document.body).ready(pd.ready);

	return pd;
};

pd.domSetup = (opts) => {
	// Ακολουθούν οι default options.

	let stpo = {
		'resize': true,
	};

	// Θα παραλλάξουμε τις default options με βάση τις
	// options που περάσαμε.

	if (opts === undefined)
	opts = {};

	pd.objectWalk(opts, (v, k) => stpo[k] = v);

	if (stpo.resize)
	pd.windowDOM.
	on('resize', function() {
		pd.domFixup();
	});

	return pd;
};

pd.domFixup = () => {
	if (!pd.ofelimoDOM)
	return pd;

	let h = pd.windowDOM.innerHeight();

	if (pd.toolbarDOM)
	h -= pd.toolbarDOM.outerHeight(true);

	if (pd.ribbonDOM)
	h -= pd.ribbonDOM.outerHeight(true);

	if (pd.fyiDOM)
	h -= pd.fyiDOM.outerHeight(true);

	pd.ofelimoDOM.height(0);
	h -= pd.ofelimoDOM.outerHeight(true);

	pd.ofelimoDOM.height(h);
	return pd;
};

///////////////////////////////////////////////////////////////////////////////@

pd.toolbarSetup = () => {
	pd.toolbarDOM = $('<div>').addClass('pnd-toolbar').
	append(pd.toolbarLeftDOM = $('<div>').addClass('pnd-trLeft')).
	append(pd.toolbarCenterDOM = $('<div>').addClass('pnd-trCenter')).
	append(pd.toolbarRightDOM = $('<div>').addClass('pnd-trRight'));
	pd.bodyDOM.append(pd.toolbarDOM);

	if (php.requestIsYes('debug')) {
		pd.toolbarLeftDOM.text('Toolbar Left');
		pd.toolbarCenterDOM.text('Toolbar Center');
		pd.toolbarRightDOM.text('Toolbar Right');
	}

	return pd;
};

pd.ribbonSetup = () => {
	pd.ribbonDOM = $('<div>').addClass('pnd-ribbon').
	append(pd.ribbonLeftDOM = $('<div>').addClass('pnd-trLeft')).
	append(pd.ribbonCenterDOM = $('<div>').addClass('pnd-trCenter')).
	append(pd.ribbonRightDOM = $('<div>').addClass('pnd-trRight'));
	pd.bodyDOM.append(pd.ribbonDOM);

	if (php.requestIsYes('debug')) {
		pd.ribbonLeftDOM.text('Ribbon Left');
		pd.ribbonCenterDOM.text('Ribbon Center');
		pd.ribbonRightDOM.text('Ribbon Right');
	}

	return pd;
};

pd.fyiSetup = () => {
	pd.fyiDOM = $('<div>').
	addClass('pnd-fyi').
	on('click', function(e) {
		e.stopPropagation();
		console.log($(this).css('opacity'));
		$(this).css('opacity', $(this).css('opacity') > 0 ? 0 : 1);
	});
	pd.bodyDOM.append(pd.fyiDOM);

	if (php.requestIsYes('debug'))
	pd.fyiMessage('This is FYI message!');

	return pd;
};

pd.fyiMessage = (html) => {
	pd.fyiDOM.
	removeClass('pnd-fyiMessage').
	removeClass('pnd-fyiError');

	if (html)
	pd.fyiDOM.
	addClass('pnd-fyiMessage').
	css('opacity', 1).
	html(html);

	else
	pd.fyiDOM.
	css('opacity', 0).
	empty();

	return pd;
};

pd.fyiError = (html) => {
	pd.fyiDOM.
	addClass('pnd-fyiError').
	css('opacity', 1).
	html(html ? html : 'Error');

	return pd;
};

pd.fyiClear = () => pd.fyiMessage();

///////////////////////////////////////////////////////////////////////////////@

pd.tabDOM = (dom) => {
	let tabDOM = $('<div>').
	addClass('pnd-tab');

	if (dom)
	tabDOM.append(dom);

	return tabDOM;
};

///////////////////////////////////////////////////////////////////////////////@

pd.ofelimoSetup = () => {
	pd.ofelimoDOM = $('<div>').addClass('pnd-ofelimo');
	pd.bodyDOM.append(pd.ofelimoDOM);

	return pd;
};

pd.enterFullscreen = () => {
	let body = document.body;

	try {
		if (body.requestFullscreen)
		body.requestFullscreen();

		else if (body.webkitRequestFullScreen)
		body.webkitRequestFullScreen();

		else if (body.mozRequestFullScreen)
		body.mozRequestFullScreen();

		else if (body.msRequestFullscreen)
		body.msRequestFullscreen();
	}

	catch (e) {
		console.error(e);
	}

	return pd;
};

pd.exitFullscreen = () => {
	try {
		if (document.exitFullscreen)
		document.exitFullscreen();

		else if (document.mozCancelFullScreen)
		document.mozCancelFullScreen();

		else if (document.webkitExitFullscreen)
		document.webkitExitFullscreen();

		else if (document.msExitFullscreen)
		document.msExitFullscreen();
	}

	catch (e) {
		console.error(e);
	}

	return pd;
};

///////////////////////////////////////////////////////////////////////////////@

pd.consoleLogCount = 0;

pd.consoleLog = (s) => console.log('[' + (++pd.consoleLogCount) + ']', s);

///////////////////////////////////////////////////////////////////////////////@
