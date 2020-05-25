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
// δεν καθοριστεί παράμετρος ημερομηνίας, υποτίθεται η τρέχουσα ημερομηνία και
// ώρα.

pd.dateTime = (date, format) => {
	if (date === undefined)
	date = new Date();

	if (format === undefined)
	format = '%Y-%M-%D %h:%m:%s';

	var year = date.getFullYear();

	if (isNaN(year))
	return undefined;

	var month = date.getMonth() + 1;

	if (isNaN(month))
	return undefined;

	if (month < 10) month = '0' + month;

	var day = date.getDate();

	if (isNaN(day))
	return undefined;

	if (day < 10) day = '0' + day;

	var hour = date.getHours();

	if (isNaN(hour))
	return undefined;

	if (hour < 10) hour = '0' + hour;

	var minute = date.getMinutes();

	if (isNaN(minute))
	return undefined;

	if (minute < 10) minute = '0' + minute;

	var second = date.getSeconds();

	if (isNaN(second))
	return undefined;

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

pd.date = (date, format) => {
	if (!format)
	format = '%Y-%M-%D';
	
	return pd.dateTime(date, format);
};

pd.time = (time, format) => {
	if (!format)
	format = '%h-%m-%s';

	return pd.dateTime(time, format);
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

pd.imerominia = (date) => {
	if (!(date instanceof Date))
	return undefined;

	return date.toLocaleDateString([
		'el-GR',
		'en-US',
	], {
		'weekday': 'long',
		'year': 'numeric',
		'month': 'long',
		'day': 'numeric',
	});
};

/*
pd.ISO2date = (date) => {
	var a = date.split(/[^0-9]+/);
	return new Date(Date.UTC(a[0], --a[1], a[2], a[3], a[4], a[5]));
};
*/

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
