"use strict";

const pd = require('../lib/pandora.js');
const Isodos = {};

pd.domInit(() => {
	pd.
	domSetup().
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domFixup();

	Isodos.
	formSetup();
pd.fyiDOM.text('This is a test!');
});

Isodos.formSetup = () => {
	let formaDOM = $('<form>').addClass('pandoraForma');
	let ilistDOM = $('<table>').addClass('pandoraInputTable');

	ilistDOM.
	append($('<tr>').addClass('pandoraInput').
	append($('<td>').addClass('pandoraProtropi').text('Login')).
	append($('<td>').addClass('pandoraPedio').
	append($('<input>')))).
	append($('<tr>').addClass('pandoraInput').
	append($('<td>').addClass('pandoraProtropi').text('Password')).
	append($('<td>').addClass('pandoraPedio').
	append($('<input>').attr('type', 'password'))));

	formaDOM.
	append(ilistDOM);

	pd.ofelimoDOM.
	append(formaDOM);

	return Isodos;
};
