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
// pandoraServer.js -- JavaScript module που αποτελεί server side επέκταση
// του αντίστοιχου core module "pandoraCore.js".
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2019-12-21
// Created: 2019-12-16
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

if (!process.env.PANDORA_BASEDIR)
process.env.PANDORA_BASEDIR = '/var/opt/pandora';

const pd = require(`${process.env.PANDORA_BASEDIR}/lib/pandoraCore.js`);
module.exports = pd;

///////////////////////////////////////////////////////////////////////////////@

const util = require('util');
const path = require('path');
const fs = require('fs');

///////////////////////////////////////////////////////////////////////////////@

pd.testServer = (msg) => {
	pd.testCore('Greetings from server!');

	if (msg === undefined)
	msg = 'Hi there!';

	console.log('pandora: [testServer]: ' + msg);
};

// Εφόσον δεν έχουμε περάσει κάποιο όνομα για το πρόγραμμα, θέτουμε το όνομα
// του προγράμματος με βάση το όνομα του source file.

if (!pd.hasOwnProperty('progname')) {
	try {
		pd.progname = path.basename(process.argv[1]);
	}

	catch (e) {
		pd.progname = "unknown";
	}
}

// Η function "env" δέχεται ως παράμετρο το όνομα μιας environment variable,
// και επιστρέφει την τιμή της εν λόγω μεταβλητής.

pd.env = function(name) {
	if (name === undefined)
	return undefined;

	let a = name.split(':');
	name = a[0];

	if (!name)
	return undefined;

	if (process.env.hasOwnProperty(name))
	return process.env[name];

	if (a.length < 2)
	return undefined;

	let v = a[1].substr(1);

	for (let i = 2; i < a.length; i++)
	v += ':' + a[i];

	switch (a[1].substr(0, 1)) {
	case '=':
		process.env[name] = v;
	case '-':
		return v;
	}

	return undefined;
}

pd.errchk = (err) => {
	if (!err)
	return pd;

	throw err;
	return pd;
};

pd.errmsg = (msg) => {
	var s = '';

	if (pd.progname)
	s += pd.progname + ': ';

	process.stderr.write(s + msg + '\n');
	return pd;
};

///////////////////////////////////////////////////////////////////////////////@

// Η property "ttyMuted" λειτουργεί ως εσωτερική flag που κανονίζει αν τα
// μηνύματα ελέγχου ροής που αποστέλλουμε στην οθόνη του control terminal
// μέσω της "ttymsg" πράγματι θα εκτυπωθούν ή όχι. Καλό είναι να αλλάζουμε
// την κατάσταση της εν λόγω flag μέσω της function "ttyMute" και όχι με
// το χέρι.

pd.ttyMuted = false;

// Αν επιθυμούμε να «φιμώσουμε» τυχόν μηνύματα ροής που εκτυπώνουμε μέσω της
// "ttymsg", καλούμε την "ttyMute" είτε χωρίς παραμέτρους, είτε με παράμετρο
// true. Αντίθετα, αν επιθυμούμε να επαναφέρουμε το πρόγραμμα σε «ομιλητική»
// κατάσταση όσον αφορά στην εκτύπωση μηνυμάτων ροής, καλούμε την "ttyMute"
// με παράμετρο false.

pd.ttyMute = (mute) => {
	if (mute === undefined)
	mute = true;

	pd.ttyMuted = mute;
	return pd;
};

// Ακολουθεί stream που αναφέρεται στο control terminal για εκτύπωση
// μηνυμάτων κλπ. Αρχικά το stream παραμένει κλειστό και ανοίγει την
// πρώτη φορά που θα επιχειρήσουμε να γράψουμε μήνυμα στο τερματικό.

pd.ttyWrite = undefined;

// Η function "ttymsg" δέχεται ένα μήνυμα και το εκτυπώνει στο control
// terminal. By default η function δεν εκτυπώνει newline οπότε μπορούμε
// να εκτυπώσουμε διαδοχικά μηνύματα στην ίδια γραμμή, prompts κλπ.
// Αντίθετα, αν δεν περάσουμε μήνυμα προς εκτύπωση, η function εκτυπώνει
// έναν newline χαρακτήρα.

pd.ttymsg = (msg) => {
	if (pd.ttyMuted)
	return pd;

	if (pd.ttyWrite === undefined) {
		try {
			pd.ttyWrite = fs.createWriteStream('/dev/tty');
			pd.ttyWrite.on('error', () => {
				pd.ttyWrite = false;
			});
		}

		catch (e) {
			pd.ttyWrite = false;
		}
	}

	if (pd.ttyWrite === false)
	return pd;

	if (msg === undefined)
	msg = '\n';

	pd.ttyWrite.write(msg);
	return pd;
};

///////////////////////////////////////////////////////////////////////////////@
