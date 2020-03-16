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
			let inputDOM = paletaDOM.children('.pnd-paletaInput');
			let text = inputDOM.val();
			let list = text.split('');
			let zoomDOM = paletaDOM.children('.pnd-paletaZoom');

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

			zoomDOM = paletaDOM.children('.pnd-paletaZoom');
			pd.arrayWalk(match, (x) => {
				$('<div>').
				addClass('pnd-paletaZoomGrami').
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
		'url': '/cht/dimas/lib/odos_list.php',
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
