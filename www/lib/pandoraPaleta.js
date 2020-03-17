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

	if (typeof(helper) === 'function')
	return helper(candiDOM, paletaDOM);

	if (typeof(helper) === 'string')
	pd.fyiMessage(helper);

	let monitorDOM = paletaDOM.children('.pnd-paletaMonitor');
	let zoomDOM = paletaDOM.children('.pnd-paletaZoom');
	let ante = paletaDOM.data('ante');
	let post = paletaDOM.data('post');
	let text = candiDOM.text();
	let inputDOM = paletaDOM.children('.pnd-paletaInput');

	text = text.trim();

	if (ante !== undefined)
	text = ante + text;

	if (post !== undefined)
	text = text + post;

	zoomDOM.empty();
	monitorDOM.text(text);
	inputDOM.
	data('prev', text).
	val(text);

	if (typeof(helper) === 'string')
	pd.fyiMessage(helper);
console.log('>>' + text + '<<');

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

	if (opts.hasOwnProperty('ante'))
	paletaDOM.data('ante', opts.ante);

	if (opts.hasOwnProperty('post'))
	paletaDOM.data('post', opts.post);

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
		'text': '<div class="pnd-flip180">&#x27A0;</div>',
		'style': 'pnd-paletaBackspaceKey',
	})).
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
