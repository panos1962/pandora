(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
		'box': 'pandoraKarta',		// περίγραμμα καρτέλας
		'row': 'pandoraKartaRow',	// γραμμή πεδίου
		'sec': 'pandoraKartaSec',	// δευτερεύον πεδίο
		'col': 'pandoraKartaCol',	// όνομα πεδίου
		'val': 'pandoraKartaVal',	// τιμή πεδίου
	},

	// Η κατηγορία "grami" βοηθάει στην εμφάνιση εγγραφών (records)
	// σε μορφή γραμμής.

	'grami': {
		'row': 'pandoraGrami',		// γραμμή εγγραφής
		'val': 'pandoraGramiVal',	// τιμή πεδίου
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

	pd.objectWalk(opts, (k, v) => {
		stpo[k] = v;
	});

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
	append($('<table>').addClass('pnd-trTable').
	append($('<tr>').
	append(pd.toolbarLeftDOM = $('<td>').addClass('pnd-trLeft')).
	append(pd.toolbarCenterDOM = $('<td>').addClass('pnd-trCenter')).
	append(pd.toolbarRightDOM = $('<td>').addClass('pnd-trRight'))));
	pd.bodyDOM.prepend(pd.toolbarDOM);

	if (php.requestIsYes('debug')) {
		pd.toolbarLeftDOM.text('Toolbar Left');
		pd.toolbarCenterDOM.text('Toolbar Center');
		pd.toolbarRightDOM.text('Toolbar Right');
	}

	return pd;
};

pd.ribbonSetup = () => {
	pd.ribbonDOM = $('<div>').addClass('.pnd-ribbon').
	append($('<table>').addClass('pnd-trTable').
	append($('<tr>').
	append(pd.ribbonLeftDOM = $('<td>').addClass('pnd-trLeft')).
	append(pd.ribbonCenterDOM = $('<td>').addClass('pnd-trCenter')).
	append(pd.ribbonRightDOM = $('<td>').addClass('pnd-trRight'))));
	pd.bodyDOM.append(pd.ribbonDOM);

	if (php.requestIsYes('debug')) {
		pd.ribbonLeftDOM.text('Ribbon Left');
		pd.ribbonCenterDOM.text('Ribbon Center');
		pd.ribbonRightDOM.text('Ribbon Right');
	}

	return pd;
};

pd.fyiSetup = () => {
	pd.fyiDOM = $('<div>').addClass('pnd-fyi');
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
	css('visibility', 'visible').
	html(html);

	else
	pd.fyiDOM.
	css('visibility', '').
	empty();

	return pd;
};

pd.fyiError = (html) => {
	pd.fyiDOM.
	addClass('pnd-fyiError').
	css('visibility', 'visible').
	html(html ? html : 'Error');

	return pd;
};

pd.fyiClear = () => pd.fyiMessage();

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

},{"../lib/pandoraCore.js":2}],2:[function(require,module,exports){
(function (process){
///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// javascipt
// @FILETYPE END
//
// @FILE BEGIN
// pandoraCore.js -- JavaScript core module για χρήση τόσο στον server
// (node), όσο και στον client (browser).
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2019-12-25
// Updated: 2019-12-24
// Updated: 2019-12-21
// Created: 2019-12-20
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd = {};
module.exports = pd;

///////////////////////////////////////////////////////////////////////////////@

// Η λίστα "param" περιέχει διάφορες χρήσιμες παραμέτρους γενικής χρήσης.

pd.param = {};

// Η παράμετρος "filler" είναι τελείως επουσιώδης και χρειάζεται κυρίως για
// το filling των input prompts με αποσιωπητικά. Αν π.χ. έχουμε το prompt
// "Ονοματεπώνυμο" μπορούμε να προσθέσουμε σε αυτό την παράμετρο "filler"
// προκειμένου να εμφανίσουμε:
//
//	Ονοματεπώνυμο……………… Παναγιώτης Παπαδόπουλος
//
// και ακολουθώντας παρόμοια τακτική για όλα τα πεδία:
//
//	Κωδικός……………………………… 3307
//	Ονοματεπώνυμο……………… Παναγιώτης Παπαδόπουλος
//	Διεύθυνση………………………… Μητρ. Καλλίδου 45
//	Τηλέφωνο…………………………… 2310-456789
//	Κινητό………………………………… 6977-456789

pd.param.filler = '';

///////////////////////////////////////////////////////////////////////////////@

// Η function "testCore" χρησιμοποιείται κυρίως για να διαπιστώσουμε την
// επιτυχή συμπερίληψη του ανά χείρας module. Πιο συγκεκριμένα, επειδή το
// core module είναι κοινό τόσο στον server όσο και στον client, μπορούμε
// να καλέσουμε την "testCore" προκειμένου να δούμε αν έχει φορτωθεί σωστά
// το pandora core mudule.
//
// Server side:
//
//	...
//	if (!process.env.PANDORA_BASEDIR)
//	process.env.PANDORA_BASEDIR = '/var/opt/pd';
//
//	const pandora = require(`${process.env.PANDORA_BASEDIR}/lib/pandoraServer.js`);
//	pandora.testServer();
//	...
//
// Client side:
//
//	selida.js:
//		...
//		const pandora = require('../../lib/pandoraClient.js');
//		pandora.testClient();
//		...
//
//	Makefile:
//		...
//		THIS_DEVDIR = ../..
//		BUNDLEJS = bundle.js
//
//		.PHONY: all
//		all: $(BUNDLE)
//
//		$(BUNDLE): selida.sj \
//			$(THIS_DEVDIR)/lib/pandoraClient.js \
//			$(THIS_DEVDIR)/lib/pandoraCore.js \
//			browserify -p tinyify -o $@ $^
//		...
//
//	index.html
//		...
//		<html>
//			<head>
//				...
//				<script src="bundle.js"></script>
//				...
//			</head>
//			<body>
//				...
//			</body>
//		</html>

pd.testCore = (msg) => {
	if (msg === undefined)
	msg = 'Hi there!';

	console.log('pandora: [testCore]: ' + msg);
};

// Η function "noop" είναι dummy και δεν κάνει απολύτως τίποτα. Η χρήση της
// αφορά κυρίως στην «ακύρωση» άλλων functions και μεθόδων.

pd.noop = () => {
	return pd;
};

// Η function "objectInit" δέχεται ως πρώτη παράμετρο ένα αντικείμενο (target),
// ως δεύτερη παράμετρο ένα άλλο αντικείμενο (source), ενώ ως τρίτη παράμετρο
// δέχεται ένα τρίτο αντικείμενο στο οποίο καθορίζονται παράμετροι (options)
// που διαφοροποιούν τη λειτουργία τής function όσον αφορά επιμέρους θέματα.
//
// Σκοπός τής function είναι να αρχικοποιήσει το target object, με οδηγό το
// source object. Πιο συγκεκριμένα, η συνήθης χρήση της function είναι να
// καλείται σε νεόκοπα objects με σκοπό να πάρουν αρχικές τιμές οι properties
// του αντικειμένου με βάση τις properties του source object.

pd.objectInit = function(target, source, opts) {
	if (source === undefined)
	return target;

	if (!opts)
	opts = {
		'functions': false,
		'recursive': true,
	};

	for (let i in source) {
		let j = ((opts.hasOwnProperty('colmap') &&
			opts.colmap.hasOwnProperty(i)) ? opts.colmap[i] : i);

		if (source[i] === undefined) {
			target[j] = undefined;
			continue;
		}

		if (source[i] === null) {
			target[j] = null;
			continue;
		}

		if (typeof(source[i]) === 'function') {
			if (opts.functions)
			target[j] = source[i];

			continue;
		}

		if (typeof(source[i]) !== 'object') {
			target[j] = source[i];
			continue;
		}

		if (Array.isArray(source[i])) {
			target[j] = pd.arrayInit(new Array(), source[i], opts);
			continue;
		}

		if (!opts.recursive) {
			continue;
		}

		if (source[i].constructor &&
			(typeof(source[i].constructor) === Function)) {
			target[j] = pd.objectInit(new source[i].constructor(),
				source[i], opts);
			continue;
		}

		target[j] = pd.objectInit(new Object(), source[i], opts);
	}

	return target;
};

pd.arrayInit = function(target, source, opts) {
	if (source === undefined)
	return target;

	if (!opts)
	opts = {
		'functions': false,
		'recursive': true,
	};

	for (let i = 0; i < source.length; i++) {
		if (source[i] === undefined) {
			target[i] = undefined;
			continue;
		}

		if (source[i] === null) {
			target[i] = null;
			continue;
		}

		if (typeof(source[i]) !== 'object') {
			target[i] = source[i];
			continue;
		}

		if (!opts.recursive) {
			continue;
		}

		if (Array.isArray(source[i])) {
			target[i] = pd.arrayInit(new Array(), source[i], opts);
			continue;
		}

		if (source[i].constructor &&
			(typeof(source[i].constructor) === 'function')) {
			target[i] = pd.objectInit(new source[i].constructor(),
				source[i], opts);
			continue;
		}

		target[i] = pd.objectInit(new Object(), source[i], opts);
	}

	return target;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "dateTime" επιστρέφει ημερομηνίες ως strings. Η μορφή τής
// ημερομηνίας που θα επιστραφεί καθορίζεται από το format sting που περνάμε
// ως δεύτερη παράμετρο και το οποίο μπορεί να περιέχει κωδικές περιγραφές για
// το έτος ("%Y"), τον μήνα ("%M"), την ημέρα ("%D"), την ώρα ("%h"), το λεπτό
// ("%m") και το δευτερόλεπτο ("%s"). Οι υπόλοιποι χαρακτήρες τού format string
// επιστρέφονται αυτούσιοι, ενώ το σύμβολο "%" είναι καλό να δίνεται ως "%%",
// προκειμένου να μην εκληφθεί ως προδιαγραφή κάποιου χρονικού στοιχείου. Αν
// δεν καθορίσουμε format string, τότε υποτίθεται το "%Y-%M-%D %h:%m:%s". Αν
// δεν καθορστεί παράμετρος ημερομηνίας, υποτίθεται η τρέχουσα ημερομηνία και
// ώρα.

pd.dateTime = (date, format) => {
	if (date === undefined)
	date = new Date();

	if (format === undefined)
	format = '%Y-%M-%D %h:%m:%s';

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	if (month < 10) month = '0' + month;

	var day = date.getDate();
	if (day < 10) day = '0' + day;

	var hour = date.getHours();
	if (hour < 10) hour = '0' + hour;

	var minute = date.getMinutes();
	if (minute < 10) minute = '0' + minute;

	var second = date.getSeconds();
	if (second < 10) second = '0' + second;

	return format.
	replace(/%%/g, '').
	replace(/%Y/g, year).
	replace(/%M/g, month).
	replace(/%D/g, day).
	replace(/%h/g, hour).
	replace(/%m/g, minute).
	replace(/%s/g, second).
	replace(//g, '%')
};

pd.date = (date) => {
	return pd.dateTime(date, '%Y-%M-%D');
};

pd.time = (time) => {
	return pd.dateTime(time, '%h-%m-%s');
};

pd.date2date = (date, from, to) => {
	if (date === undefined)
	return undefined;

	if (date === null)
	return null;

	if ((typeof(date) === 'object') && (date instanceof Date))
	return pd.date(date, to);

	if (typeof(date) !== 'string')
	return undefined;

	let f = from.split(/[^YMDhms]+/);

	if ((f.length === 1) && (f[0] === from))
	f = from.split('');

	let a = date.split(/[^0-9]+/);
	let l = f.length;

	if (a.length < l)
	l = a.length;

	if (l <= 0)
	return undefined;

	let vfrom = {};

	for (let i = 0; i < l; i++)
	vfrom[f[i]] = a[i];

	return to.
	replace(/%%/g, '').
	replace(/%Y/g, vfrom['Y']).
	replace(/%M/g, vfrom['M']).
	replace(/%D/g, vfrom['D']).
	replace(/%h/g, vfrom['h']).
	replace(/%m/g, vfrom['m']).
	replace(/%s/g, vfrom['s']).
	replace(//g, '%')
};

pd.ISO2date = (date) => {
	var a = date.split(/\D+/);
	return new Date(Date.UTC(a[0], --a[1], a[2], a[3], a[4], a[5], a[6]));
};

///////////////////////////////////////////////////////////////////////////////@

pd.strPush = (s, t, r) => {
	if (t === undefined)
	return s;

	if (t === '')
	return s;

	if (r === undefined)
	r = ' ';

	if (s)
	s += r;

	else
	s = '';

	return (s += t);
};

// Η function "gramata" «σπάζει» το string που περνάμε ως παράμετρο στους
// επιμέρους χαρακτήρες που το αποτελούν και τους επιστρέφει ως array
// εξαιρώντας όμως χαρακτήρες που δεν είναι γράμματα ή αριθμοί.

pd.gramata = (s) => {
	if (s === undefined)
	return [];

	if (typeof(s) !== 'string')
	return [];

	return s.replace(/[^a-zA-Z0-9\u0370-\u03ff]/g, '').split('');
};

///////////////////////////////////////////////////////////////////////////////@

pd.random = (max, min) => {
	if (max === undefined)
	max = Number.MAX_SAFE_INTEGER;

	if (min === undefined)
	min = 0;

	return Math.floor(Math.random() * (max - min)) + min;
};

pd.randar = (a) => {
	return a[pd.random(a.length)];
};

// Η function "colvaSet" καλείται ως μέθοδος μέσω της "call" και θέτει την
// τιμή ("val") μιας property ("col") εφόσον η τιμή αυτή είναι ορισμένη.

pd.colvalSet = function(col, val) {
	delete this[col];

	if (val === undefined)
	return this;

	if (val === null)
	return this;

	this[col] = val;

	return this;
};

// Η function "colvaGet" καλείται ως μέθοδος μέσω της "call" και επιστρέφει
// την τιμή μιας property ("col") εφόσον η τιμή αυτή είναι ορισμένη, αλλιώς
// επιστρέφει ένα κενό string.

pd.colvalGet = function(col) {
	const noval = '';

	if (!this.hasOwnProperty(col))
	return noval;

	if (this[col] === undefined)
	return noval;

	if (this[col] === null)
	return noval;

	return this[col];
};

///////////////////////////////////////////////////////////////////////////////@

pd.objectWalk = function(obj, callback) {
	for (let i in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, i))
		callback(obj[i], i);
	}

	return obj;
};

pd.objectWalkCond = function(obj, callback) {
	for (let i in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, i))
		continue;

		if (!callback(obj[i], i))
		break;
	}

	return obj;
};

pd.arrayWalk = function(arr, callback) {
	for (let i = 0; i < arr.length; i++)
	callback(arr[i], i);

	return arr;
};

pd.arrayWalkCond = function(arr, callback) {
	for (let i = 0; i < arr.length; i++) {
		if (!callback(arr[i], i))
		break;
	}

	return arr;
};

///////////////////////////////////////////////////////////////////////////////@

pd.centsToEuros = (x, opts) => {
	if (opts === undefined)
	opts = {};

	if (!opts.hasOwnProperty('zero'))
	opts.zero = true;

	if (!opts.hasOwnProperty('triad'))
	opts.triad = '';

	if (!opts.hasOwnProperty('cents'))
	opts.cents = ',';

	if (!opts.hasOwnProperty('post'))
	opts.post = '';

	if (x === undefined)
	return undefined;

	switch (typeof x) {
	case 'number':
		break;
	case 'string':
		x = x.trim();

		if (!x.match(/^-?[0-9]+$/))
		return undefined;

		x = parseInt(x);
		break;
	default:
		return undefined;
	}

	if (x === 0)
	return (opts.zero ? '0.00' + opts.post : '');

	let prosimo = '';

	if (x < 0) {
		x = -x;
		prosimo = '-';
	}

	let cents = x % 100;
	let euros = ((x - cents) / 100).toString()

	if (cents < 10)
	cents = '0' + cents;

	else
	cents = cents.toString();

	if (!opts.triad)
	return prosimo + euros + opts.cents + cents + opts.post;

	let s = euros.split('');
	let l = s.length;
	let i = l - 1;
	let n = 0;
	let t = '';

	while (i >= 0) {
		if (n === 3) {
			t += opts.triad;
			n = 0;
		}

		t += s[i];
		n++;
		i--;
	}

	s = t.split('');
	euros = '';

	while ((t = s.pop()) !== undefined)
	euros += t;

	return prosimo + euros + opts.cents + cents + opts.post;
};

///////////////////////////////////////////////////////////////////////////////@

pd.debug = (msg, opts) => {
	let stream = process.stderr;

	if (opts === undefined)
	opts = {};

	if (opts.hasOwnProperty('stream')) {
		stream = opts.stream;
		delete opts.stream;
	}

	if (!opts.hasOwnProperty('depth'))
	opts.depth = Infinity;

	if (!opts.hasOwnProperty('compact'))
	opts.compact = false;

	if (!opts.hasOwnProperty('colors'))
	opts.colors = stream.isTTY;

	stream.write(pd.dateTime());

	if (!msg)
	return pd;

	stream.write(' >>');
	stream.write(typeof(msg) === 'string' ? msg : util.inspect(msg, opts));
	stream.write('<<\n');

	return pd;
};

///////////////////////////////////////////////////////////////////////////////@

pd.initCore = () => {
	for (let i = 0; i < 100; i++)
	pd.param.filler += '&hellip;';
};

pd.initCore();
delete pd.initCore;

///////////////////////////////////////////////////////////////////////////////@

}).call(this,require('_process'))
},{"_process":6}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
// www/lib/pandoraPaleta.js —— JavaScript client module που αφορά σε εικονικά
// πληκτρολόγια.
// @FILE END
//
// @HISTORY BEGIN
// Updated: 2020-03-07
// Updated: 2020-03-06
// Updated: 2020-02-08
// Updated: 2020-02-05
// Updated: 2020-02-01
// Updated: 2020-01-24
// Updated: 2020-01-22
// Created: 2020-01-20
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";
module.exports = function(pd) {

///////////////////////////////////////////////////////////////////////////////@

pd.paletaSetupOk = false;

pd.paletaSetup = () => {
	if (pd.paletaSetupOk)
	return pd;

	let candiClasses = '.pnd-paletaMonitor';
	candiClasses += ',.pnd-paletaZoomGrami';

	pd.paletaSetupOk = true;

	pd.bodyDOM.
	on('mouseenter', '.pnd-paletaPliktroContainer', function(e) {
		e.stopPropagation();
		$(this).children('.pnd-paletaPliktro').
		addClass('pnd-paletaPliktroHover');
	}).
	on('mouseleave', '.pnd-paletaPliktroContainer', function(e) {
		e.stopPropagation();
		$(this).children('.pnd-paletaPliktro').
		removeClass('pnd-paletaPliktroHover');
	}).
	on('click', '.pnd-paletaPliktroContainer', function(e) {
		e.stopPropagation();

		let pliktroDOM = $(this).children('.pnd-paletaPliktro');
		let paletaDOM = $(this).closest('.pnd-paleta');
		let monitorDOM = paletaDOM.children('.pnd-paletaMonitor');
		let zoomDOM = paletaDOM.children('.pnd-paletaZoom');
		let inputDOM = paletaDOM.children('.pnd-paletaInput');
		let text = inputDOM.val();
		let special = $(this).data('special');

		inputDOM.focus();

		// Παράμετρο (data) "special" έχουν τα ειδικά πλήκτρα όπως
		// το backspace, το πλήκτρο εναλλαγής πληκτρολογίου κλπ.

		switch (special) {

		// Το πλήκτρο "BACKSPACE" διαγράφει τον τελευταίο χαρακτήρα
		// του input field.

		case 'BACKSPACE':
			text = text.slice(0, -1);
			break;

		// Το πλήκτρο "TOGGLE" «καθαρίζει» το input field αφού
		// προηγουμένως κρατήσει το περιεχόμενο στην παράμετρο
		// (data) "content", και το αντίστροφο.

		case 'TOGGLE':
			if (text) {
				monitorDOM.data('content', text);
				text = '';
				pliktroDOM.
				attr('title', 'Επαναφορά τιμής πεδίου').
				removeClass('pnd-paletaClearKey').
				addClass('pnd-paletaRecallKey').
				html('&#x21B7;');
			}

			else {
				text = monitorDOM.data('content');
				pliktroDOM.
				attr('title', 'Καθαρισμός πεδίου').
				removeClass('pnd-paletaRecallKey').
				addClass('pnd-paletaClearKey').
				html('&#x21B6;');
			}

			break;

		case 'ZOOM':
			switch (paletaDOM.data('zoomMode')) {
			case 'ZOOMLOOSE':
				paletaDOM.data('zoomMode', 'ZOOMSTRICT');
				pd.paletaPliktroZoomDOM(paletaDOM);
				break;
			case 'ZOOMSTRICT':
				paletaDOM.data('zoomMode', 'ZOOMMEDIUM');
				pd.paletaPliktroZoomDOM(paletaDOM);
				break;
			default:
				paletaDOM.data('zoomMode', 'ZOOMLOOSE');
				pd.paletaPliktroZoomDOM(paletaDOM);
				break;
			}

			break;

		// Το πλήκτρο "SUBMIT" προκαλεί submit και change events ακόμη
		// και αν δεν έχει αλλάξει η τιμή της παλέτας.

		case 'SUBMIT':
			pd.paletaEpilogi(monitorDOM,
			paletaDOM.removeData('text'));
			break;

		// Το πλήκτρο "KEYBOARD" εναλλάσσει κυκλικά τα πληκτρολόγια
		// της παλέτας, π.χ. από ελληνικά σε αγγλικά, από αγγλικά σε
		// σύμβολα, και από σύμβολα πάλι σε ελληνικά.

		case 'KEYBOARD':
			let paleta = paletaDOM.data('paleta');
			paletaDOM.data('keyboard', (paletaDOM.data('keyboard') + 1) % paleta.length);
			pd.paletaKeyboard(paletaDOM);
			return;

		case 'SPACE':
			text += ' ';
			break;

		case 'STRIPTEASE':
			if (monitorDOM.hasClass('pnd-paletaMonitorScrambled')) {
				monitorDOM.removeClass('pnd-paletaMonitorScrambled');
				paletaDOM.find('.pnd-paletaStripteaseKey').
				children().first().addClass('pandoraFlip180');
			}

			else {
				monitorDOM.addClass('pnd-paletaMonitorScrambled');
				paletaDOM.find('.pnd-paletaStripteaseKey').
				children().first().removeClass('pandoraFlip180');
			}

			break;

		// Αν το πλήκτρο δεν περιέχει παράμετρο (data) "special",
		// τότε θεωρείται απλό πλήκτρο και απλώς προστίθεται στο
		// input ο χαρακτήρας που περιέχει το πλήκτρο.

		default:
			text += pliktroDOM.text();
			break;
		}

		inputDOM.
		data('prev', text).
		val(text);

		monitorDOM.text(text);

		// Έχουμε ενημερώσει το input field και το monitor field
		// και προχωρούμε σε τυχόν περαιτέρω ενέργειες μέσω της
		// function "scribe" που ενδεχομένως έχουμε καθορίσει για
		// την παλέτα, π.χ. αναζητήσεις σε πίνακα τιμών κλπ.

		paletaDOM.data('scribe')(paletaDOM);
	}).
	on('keydown', '.pnd-paletaInput', function(e) {
		e.stopPropagation();

		let inputDOM = $(this);
		let paletaDOM = inputDOM.closest('.pnd-paleta');
		let monitorDOM = paletaDOM.children('.pnd-paletaMonitor');
		let text = inputDOM.val();

		switch (e.code) {
		case 'Escape':
			if (text) {
				monitorDOM.data('content', text);
				text = '';
			}

			else
			text = monitorDOM.data('content');
			break;
		case 'Enter':
			let candiDOM = paletaDOM.
			find('.pnd-paletaCandi').
			first()

			if (!candiDOM.length)
			candiDOM = monitorDOM;

			return pd.paletaCandiEpilogi(candiDOM);
		case 'ArrowDown':
		case 'ArrowUp':
			pd.paletaNavigate(paletaDOM, e.code);
			// fallthrough
		default:
			return;
		}

		inputDOM.val(text);
		monitorDOM.text(text);
	}).
	on('keyup', '.pnd-paletaInput', function(e) {
		e.stopPropagation();

		let inputDOM = $(this);
		let paletaDOM = inputDOM.closest('.pnd-paleta');
		let monitorDOM = paletaDOM.children('.pnd-paletaMonitor');
		let prev = inputDOM.data('prev');
		let text = inputDOM.val();

		if (text === prev)
		return;

		inputDOM.data('prev', text);
		monitorDOM.text(text);
		paletaDOM.data('scribe')(paletaDOM);
	}).

	on('mouseenter', candiClasses, function(e) {
		e.stopPropagation();

		$(this).addClass('pnd-paletaCandi');
	}).
	on('mouseleave', candiClasses, function(e) {
		e.stopPropagation();

		$(this).removeClass('pnd-paletaCandi');
	}).
	on('click', '.pnd-paletaCandi', function(e) {
		e.stopPropagation();
		pd.paletaCandiEpilogi($(this));
	}).

	// Κάποιες παλέτες είναι εφοδιασμένες με «ράφια» μέσω των οποίων
	// παρέχονται ευκολίες γραφής, π.χ. για τη μάρκα οχήματος μπορεί
	// να παρέχεται ράφι με τις συνήθεις μάρκες οχημάτων, ενώ άλλο
	// ράφι μπορεί να περιέχει χρωματολόγιο επιλογής χρώματος κοκ.
	// Τα ράφια μπορούν να έχουν τίτλο ο οποίος, εφόσον υπάρχει,
	// εμφανίζεται στο επάνω αριστερά μέρος του ραφιού και δύναται
	// να οπλιστεί με onlcick function. Τα παραπάνω καθορίζονται με
	// τις options "titlos" και "titlosClick" κατά τη δημιουργία του
	// ραφιού. Εφόσον έχει καθοριστεί onclick function τίτλου, τότε
	// αυτή θα κληθεί με παράμετρο το DOM element του ραφιού.

	on('click', '.pnd-paletaRafiTitlos', function(e) {
		e.stopPropagation();

		let onclick = $(this).data('titlosClick');

		if (!onclick)
		return;

		let rafiDOM = $(this).parent();
		onclick(rafiDOM);
	});

	return pd;
};

pd.paletaCandiEpilogi = (candiDOM) => {
	if (!candiDOM.length)
	return pd;

	let paletaDOM = candiDOM.closest('.pnd-paleta');

	if (candiDOM.hasClass('pnd-paletaMonitor'))
	return pd.paletaEpilogi(candiDOM);

	let helper = paletaDOM.data('helper');

	if (!helper)
	return pd.paletaEpilogi(candiDOM, paletaDOM);

	if (typeof(helper) === 'string')
	pd.fyiMessage(helper);

	let monitorDOM = paletaDOM.children('.pnd-paletaMonitor');
	let zoomDOM = paletaDOM.children('.pnd-paletaZoom');
	let inputDOM = paletaDOM.children('.pnd-paletaInput');
	//let curVal = inputDOM.val();
	let ante = inputDOM.data('ante');
	let post = inputDOM.data('post');
	let text = candiDOM.text();

	text = text.trim();

	if (text)
	text += ' ';

	if (ante)
	text = ante + text;

	if (post)
	text = text + post;

	zoomDOM.empty();
	monitorDOM.text(text);
	inputDOM.
	data('prev', text).
	val(text);

	if (inputDOM.hasClass('pnd-paletaInputVisible'))
	inputDOM.focus();

	return pd;
};

pd.paletaEpilogi = (textDOM, paletaDOM) => {
	if (paletaDOM === undefined)
	paletaDOM = textDOM.closest('.pnd-paleta');

	let textPrev = paletaDOM.data('text');
	let text = textDOM.text();

	if (text === undefined)
	text = '';

	switch (typeof text) {
	case 'number':
		text = text.toString();
		break;
	case 'string':
		break;
	default:
		text = '';
		break;
	}

	let value = textDOM.data('value');

	if (value === undefined)
	paletaDOM.removeData('value');

	else
	paletaDOM.data('value', value);

	paletaDOM.data('submit')(paletaDOM);

	if (text === textPrev)
	return;

	paletaDOM.data('text', text);
	paletaDOM.data('change')(paletaDOM);

	return pd;
};

pd.paletaPliktroZoomDOM = (paletaDOM) => {
	let mode = paletaDOM.data('zoomMode');
	let pliktroDOM = paletaDOM.find('.pnd-paletaZoomModeKey').first();

	switch (mode) {
	case 'ZOOMLOOSE':
		pliktroDOM.
		attr('title', 'Αυστηρά οπουδήποτε').
		html('&#x2609;');	// ☉
		break;
	case 'ZOOMSTRICT':
		pliktroDOM.
		attr('title', 'Χαλαρά με πρώτο γράμμα').
		html('&#x2724;');	// ✤
		break;
	default:
		pliktroDOM.
		attr('title', 'Χαλαρά οπουδήποτε').
		html('&#x2731;');	// ✱
		break;
	}

	return pd;
};

pd.paletaNavigate = (paletaDOM, key) => {
	$('.pnd-paletaCandi').removeClass('pnd-paletaCandi');

	let match = paletaDOM.data('match');

	if (!match)
	return pd;

	if (!match.length)
	return pd;

	let pointer = paletaDOM.data('matchPointer');
//XXX
console.log('<<<', pointer);

	switch (key) {
	case 'ArrowDown':
		if (pointer === undefined)
		pointer = 0;

		else
		pointer++;

		break;
	case 'ArrowUp':
		if (pointer === undefined)
		pointer = match.length - 1;

		else
		pointer--;

		break;
	default:
		return pd;
	}

	if ((pointer < 0) || (pointer >= match.length)) {
		paletaDOM.
		children('.pnd-paletaMonitor').
		addClass('pnd-paletaCandi');

		paletaDOM.removeData('matchPointer');
		return pd;
	}

	paletaDOM.
	children('.pnd-paletaZoom').
	children('.pnd-paletaZoomGrami').
	filter((i) => (i === pointer)).
	addClass('pnd-paletaCandi');

	paletaDOM.data('matchPointer', pointer);
	return pd;
};

pd.paletaPaleta = function(charset, code) {
	if (code !== undefined)
	this.code = code;

	this.charset = charset;
};

pd.paletaList = {
	'latin': new pd.paletaPaleta('1234567890QWERTYUIOPASDFGHJKLZXCVBNM', 'EN'),
	'greek': new pd.paletaPaleta('1234567890-:ΕΡΤΥΘΙΟΠΑΣΔΦΓΗΞΚΛΖΧΨΩΒΝΜ', 'GR'),
	'symbol': new pd.paletaPaleta('1234567890!@#$%^&*(),._+-/=:;?{}[]<>"\'|\\', 'SM'),
	'digit': new pd.paletaPaleta('1234567890', 'DG'),
};

pd.paleta = (opts) => {
	if (opts === undefined)
	opts = {};

	if (!opts.hasOwnProperty('paleta'))
	opts.paleta = [
		pd.paletaList['greek'],
		pd.paletaList['latin'],
		pd.paletaList['symbol'],
	];

	else if (typeof opts.paleta === 'string')
	opts.paleta = [ new pd.paletaPaleta(opts.paleta) ];

	else if (!Array.isArray(opts.paleta))
	opts.paleta = [ opts.paleta ];

	if (!opts.hasOwnProperty('scribe'))
	opts.scribe = $.noop;

	if (!opts.hasOwnProperty('submit'))
	opts.submit = $.noop;

	if (!opts.hasOwnProperty('change'))
	opts.change = $.noop;

	if (!opts.hasOwnProperty('text'))
	opts.text = '';

	let paletaDOM = $('<div>').
	data('paleta', opts.paleta).
	data('keyboard', 0).
	data('scribe', opts.scribe).
	data('zoom', opts.zoom).
	data('submit', opts.submit).
	data('change', opts.change).
	data('text', opts.text).
	addClass('pnd-paleta');

	if (opts.hasOwnProperty('helper'))
	paletaDOM.data('helper', opts.helper);

	$('<div>').
	addClass('pnd-paletaKeyboard').
	appendTo(paletaDOM);

	pd.paletaKeyboard(paletaDOM);
	paletaDOM.appendTo(pd.bodyDOM);
	paletaDOM.css('width', paletaDOM.outerWidth() + 'px');
	pd.bodyDOM.remove(paletaDOM);

	let gramiDOM = $('<div>').
	addClass('pnd-paletaGrami').
	addClass('pnd-paletaGramiTools').
	appendTo(paletaDOM);

	let paleta = paletaDOM.data('paleta');
	let keyboard = (paletaDOM.data('keyboard') + 1) % paleta.length;

	// Στο DOM της παλέτας περιλαμβάνεται και HTML input field το
	// οποίο βοηθά στην περίπτωση που το πληκτρολόγιο είναι ενεργό.
	// Κανονικά ο τύπος του πεδίου αυτού είναι "text" αλλά υπάρχει
	// περίπτωση η παλέτα να εξυπηρετεί τη γραφή κάποιου κωδικού,
	// password κλπ. Σ' αυτήν την περίπτωση θέτουμε την παράμετρο
	// "tipos" σε "password" οπότε το μεν input πεδίο λειτουργεί
	// ως password input field, ενώ το monitor field εμφανίζεται
	// αρκετά ομιχλώδες ώστε να μην είναι εύκολο να διαβαστεί το
	// κείμενο που πληκτρολογεί ο χρήστης.

	if (!opts.tipos)
	opts.tipos = 'text';

	// Στην περίπτωση της παλέτας κρυφού πεδίου (password κλπ),
	// παρέχεται η δυνατότητα εναλλαγής αναγνωσιμότητας του πεδίου
	// μέσω ειδικού πλήκτρου στο αριστερό μέρος της παλέτας που
	// φέρει το σύμβολο yin & yang.

	if (opts.tipos === 'password')
	gramiDOM.
	append(pd.paletaPliktroDOM({
		'special': 'STRIPTEASE',
		'title': 'Password show/hide',
		'text': '<div style="display: inline-block;">&#x262F</div>',	// σύμβολο yin & yang
		'style': 'pnd-paletaStripteaseKey',
	}));

	gramiDOM.
	append(pd.paletaPliktroDOM({
		'special': 'KEYBOARD',
		'title': 'Αλλαγή πληκτρολογίου',
		'text': paleta[keyboard].code,
		'style': 'pnd-paletaKeyboardSwitchKey',
	})).
	append(pd.paletaPliktroDOM({
		'special': 'SPACE',
		'text': 'SPACE',
		'style': 'pnd-paletaSpaceKey',
	}));

	if (!opts.hasOwnProperty('zoomMode'))
	opts.zoomMode = 'ZOOMMEDIUM';

	paletaDOM.data('zoomMode', opts.zoomMode);

	if (opts.zoom)
	pd.paletaPliktroDOM({
		'special': 'ZOOM',
		'style': 'pnd-paletaZoomModeKey',
	}).
	appendTo(gramiDOM);

	pd.paletaPliktroZoomDOM(paletaDOM);

	gramiDOM.
	append(pd.paletaPliktroDOM({
		'special': 'BACKSPACE',
		'title': 'Backspace',
		'text': '&#x27A0;',
		'style': 'pnd-paletaBackspaceKey',
	}).addClass('pandoraFlip180')).
	append(pd.paletaPliktroDOM({
		'special': 'TOGGLE',
		'title': 'Καθαρισμός/Επαναφορά τιμής πεδίου',
		'text': '&#x21B6;',
		'style': 'pnd-paletaClearKey',
	})).
	append(pd.paletaPliktroDOM({
		'special': 'SUBMIT',
		'title': 'Υποβολή τιμής πεδίου',
		'text': '&#x21B5;',
		'style': 'pnd-paletaSubmitKey',
	}));

	let monitorDOM = $('<div>').addClass('pnd-paletaMonitor');

	if (!opts.hasOwnProperty('text'))
	opts.text = '';

	// Ακολουθεί άχρηστο input field με σκοπό την αποφυγή τού
	// autocomplete στο input field.

	$('<input>').
	prop({
		'type': 'text',
		'autocomplete': 'off',
	}).
	css('display', 'none').
	appendTo(paletaDOM);

	let inputDOM = $('<input>').
	prop('type', opts.tipos).
	addClass('pnd-paletaInput').
	data('prev', opts.text).
	val(opts.text).
	appendTo(paletaDOM);

	if (opts.tipos === 'password') {
		inputDOM.prop('autocomplete', 'new-password');
		monitorDOM.addClass('pnd-paletaMonitorScrambled');
	}

	else
	inputDOM.prop('autocomplete', 'off');

	if (opts.keyboard)
	inputDOM.addClass('pnd-paletaInputVisible');

	monitorDOM.
	data('text', opts.text).
	text(opts.text).
	appendTo(paletaDOM);

	$('<div>').
	addClass('pnd-paletaZoom').
	appendTo(paletaDOM);

	return paletaDOM;
};

pd.paletaPliktroDOM = (opts) => {
	if (typeof opts === 'string')
	opts = {
		'text': opts,
	};

	let containerDOM = $('<div>').
	addClass('pnd-paletaPliktroContainer');

	let pliktroDOM = $('<div>').
	addClass('pnd-paletaPliktro').
	appendTo(containerDOM);

	if (opts.hasOwnProperty('special')) {
		containerDOM.data('special', opts.special);
		pliktroDOM.addClass('pnd-paletaPliktroSpecial');
	}

	if (opts.hasOwnProperty('style'))
	pliktroDOM.addClass(opts.style);

	if (opts.hasOwnProperty('title'))
	pliktroDOM.attr('title', opts.title);

	pliktroDOM.
	html(opts.text);

	return containerDOM;
};

pd.paletaKeyboard = (paletaDOM) => {
	let keyboard = paletaDOM.data('keyboard');
	let paleta = paletaDOM.data('paleta');

	let keyboardDOM = paletaDOM.children('.pnd-paletaKeyboard');
	let list = paleta[keyboard].charset.split('');
	let gramiDOM;
	let i = 0;

	keyboardDOM.empty();
	pd.arrayWalk(list, (x) => {
		if (x === '') {
			i = 0;
			return;
		}

		if (!(i % 10)) {
			gramiDOM = $('<div>').
			addClass('pnd-paletaGrami').
			appendTo(keyboardDOM);
		}

		$('<div>').
		addClass('pnd-paletaPliktroContainer').
		append($('<div>').addClass('pnd-paletaPliktro').
		text(x)).
		appendTo(gramiDOM);

		i++;
	});

	let switchDOM = paletaDOM.find('.pnd-paletaKeyboardSwitchKey');
	keyboard = (keyboard + 1) % paleta.length;
	switchDOM.text(paleta[keyboard].code);

	return pd;
};

pd.paletaActivate = (paletaDOM) => {
	paletaDOM.css('display', 'inline-block');
	paletaDOM.children('input').focus();
	return pd;
};

///////////////////////////////////////////////////////////////////////////////@

if (!pd.hasOwnProperty('paletaRafiToggleDuration'))
pd.paletaRafiToggleDuration = 100;

pd.paletaRafi = (opts) => {
	if (opts === undefined)
	opts = {};

	let rafiDOM = $('<div>').
	addClass('pnd-paletaRafi');

	pd.
	paletaRafiContent(rafiDOM, opts).
	paletaRafiTitlos(rafiDOM, opts);

	return rafiDOM;
};

pd.paletaRafiContent = (rafiDOM, opts) => {
	let contentDOM = (opts.hasOwnProperty('content') && opts.content ?
	opts.content : $('<div>')).
	addClass('pnd-paletaRafiContent').
	appendTo(rafiDOM);

	let hidden = opts.hidden;

	if (hidden)
	contentDOM.
	css('display', 'none').
	data('hidden', true);

	contentDOM.
	append(opts.content);

	return pd;
};

pd.paletaRafiTitlos = (rafiDOM, opts) => {
	if (!opts.hasOwnProperty('titlos'))
	return pd;

	if (!opts.titlos)
	return pd;

	let titlosDOM = $('<div>').
	addClass('pnd-paletaRafiTitlos').
	html(opts.titlos);

	if (opts.hasOwnProperty('titlosClick') && opts.titlosClick) {
		let onclick = opts.titlosClick;

		if (onclick === 'toggle')
		onclick = pd.paletaRafiContentToggle;

		titlosDOM.data('titlosClick', onclick);
	}

	rafiDOM.
	addClass('pnd-paletaRafiMeTitlo').
	append(titlosDOM);

	rafiDOM.
	children('.pnd-paletaRafiContent').
	addClass('pnd-paletaRafiContentMeTitlo');

	return pd;
};

pd.paletaRafiContentToggle = (rafiDOM) => {
	let contentDOM = rafiDOM.children('.pnd-paletaRafiContent');

	if (!contentDOM.length)
	return pd;

	let hidden = contentDOM.data('hidden');

	if (hidden) {
		contentDOM.css({
			'display': 'block',
			'max-height': 'none',
		});

		let height = contentDOM.height();

		contentDOM.css({
			'display': 'none',
			'max-height': 0,
		});

		contentDOM.
		css('display', 'block').
		animate({
			'opacity': 1,
			'max-height': height,
		}, pd.paletaRafiToggleDuration, () => {
			contentDOM.data('hidden', false);
		});
	}

	else
	contentDOM.
	animate({
		'opacity': 0,
		'max-height': 0,
	}, pd.paletaRafiToggleDuration, () => {
		contentDOM.
		css('display', 'none').
		data('hidden', true);
	});

	return pd;
};

///////////////////////////////////////////////////////////////////////////////@

};

},{}],5:[function(require,module,exports){
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd =
require('./lib/pandora.js');
require('./lib/pandoraPaleta.js')(pd);
require('./lib/pandoraJQueryUI.js')(pd);

///////////////////////////////////////////////////////////////////////////////@

pd.domInit(() => {
	pd.
	domSetup().
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	noop();

	pd.toolbarCenterDOM.text('xxx');
	pd.domFixup();

	Test.
	odosSetup(pd.paletaSetup);

	pd.ofelimoDOM.append('<p>This is <b>pandora</b> project!</p>');
	pd.testClient('This is "pandora" project!');

	let paleta1 = pd.paleta({
		'keyboard': php.requestIsYes('keyboard'),
		'zoom': 20,
		'scribe': (paletaDOM) => {
			let inputDOM = paletaDOM.children('.pandoraPaletaInput');
			let text = inputDOM.val();
			let list = text.split('');
			let zoomDOM = paletaDOM.children('.pandoraPaletaZoom');

			zoomDOM.empty();

			if (!list.length)
			return pd;

			let re = '';

			if (paletaDOM.data('zoomMode') === 'ZOOMSTRICT')
			re = text;

			else {
				if (paletaDOM.data('zoomMode') === 'ZOOMMEDIUM')
				re = '^';

				re += list.shift();
				pd.arrayWalk(list, (c) => {
					re += '.*' + c;
				});
			}

			let match = [];

			// Υπάρχει περίπτωση ο χρήστης να πληκτρολογήσει
			// διάφορα σύμβολα που δεν θα βγάζουν νόημα ως
			// regular expression.

			try {
				re = new RegExp(re, 'i');

				pd.arrayWalk(Test.odosList, (x) => {
					if (x.match(re)) 
					match.push(x);
				});
			}

			catch (e) {
				return pd;
			}

			if (!match.length)
			return pd;

			let zoom = paletaDOM.data('zoom');

			if (match.length > zoom)
			return pd;

			zoomDOM = paletaDOM.children('.pandoraPaletaZoom');
			pd.arrayWalk(match, (x) => {
				$('<div>').
				addClass('pandoraPaletaZoomGrami').
				text(x).
				appendTo(zoomDOM);
			});

			return pd;
		},
		'helper': true,
	}).
	appendTo(pd.ofelimoDOM);

	pd.paletaActivate(paleta1);
});

///////////////////////////////////////////////////////////////////////////////@

const Test = {};

Test.odosSetup = (callback) => {
	$.post({
		'url': 'http://localhost/cht/dimas/lib/odos_list.php',
		'success': (rsp) => {
			Test.odosList = rsp.split(/[\n\r]+/);
		},
		'fail': (err) => {
			console.error(err);
		},
	});

	callback();
	return Test;
};

///////////////////////////////////////////////////////////////////////////////@

},{"./lib/pandora.js":1,"./lib/pandoraJQueryUI.js":3,"./lib/pandoraPaleta.js":4}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[5]);
