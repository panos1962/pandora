/******************************************************************************@
**
** @BEGIN
**
** @COPYRIGHT BEGIN
** Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
** @COPYRIGHT END
**
** @FILETYPE BEGIN
** css
** @FILETYPE END
**
** @FILE BEGIN
** www/lib/pandora.css —— Default "pandora" css specifications
** @FILE END
**
** @HISTORY BEGIN
** Updated: 2020-03-07
** Updated: 2020-03-06
** Updated: 2020-02-20
** Updated: 2020-02-05
** Updated: 2020-01-17
** Created: 2020-01-13
** @HISTORY END
**
** @END
**
*******************************************************************************/

html {
	height: 100%;
}

body {
	position: relative;
	height: 100%;
	margin: 0px;

	font-family: 'Georgia', serif;
	font-size: 18px;
}

/******************************************************************************/

#pandoraToolbar {
	height: 1.6em;
	padding-bottom: 4px;
	overflow-y: hidden;

	border-style: none none solid none;
	border-width: 2px;
	border-color: #888888;
}

#pandoraToolbar tr {
	vertical-align: bottom;
}

#pandoraToolbar tr td {
	white-space: nowrap;
}

#pandoraRibbon tr td div {
	display: inline-block;
}

#pandoraRibbon {
	height: 1.6em;
	padding-top: 4px;
	overflow-y: hidden;

	border-style: solid none none none;
	border-width: 2px;
	border-color: #888888;
}

#pandoraRibbon tr {
	vertical-align: top;
}

#pandoraRibbon tr td {
	white-space: nowrap;
}

#pandoraRibbon tr td div {
	display: inline-block;
}

.pandoraTRtable {
	border-collapse: collapse;
	width: 100%;
	height: 100%;
}

.pandoraTRleft {
	width: 49.9%;
	text-align: left;
}

.pandoraTRcenter {
	text-align: center;
}

.pandoraTRright {
	width: 49.9%;
	text-align: right;
}

/******************************************************************************/

#pandoraFyi {
	visibility: hidden;

	padding: 2px;
	height: 1.2em;

	font-style: italic;
	background-color: #ffff80;
	box-shadow: 0px 1px 4px #cecece;
}

.pandoraFyiMessage {
	color: navy;
}

.pandoraFyiError {
	color: #cc0000;
}

/******************************************************************************/

#pandoraOfelimo {
	display: block;
	padding: 8px;
	overflow-y: scroll;
}

/******************************************************************************/

.pandoraForma {
	display: inline-block;
	padding: 10px;
	background-color: #f3f3f3;

	border-style: solid;
	border-width: 1px;
	border-color: #b7b7b7;
	border-radius: 10px;

	box-shadow: 2px 2px 4px #8888;
}

.pandoraInputTable {
	font-size: 100%;
}

.pandoraInput {
}

.pandoraProtropi {
	text-align: right;
	padding-right: 4px;
	font-style: italic;
}

.pandoraPedio {
	text-align: left;
}

.pandoraPedio input {
	padding-left: 2px;
	font-family: 'Roboto Condensed', sans-serif;
	font-size: 100%;
}

/******************************************************************************/
	
.pandoraKarta {
	display: inline-block;
	vertical-align: top;

	margin: 2px;
	padding: 2px;

	background-color: #fff8ed;

	border-style: solid;
	border-width: 1px;
	border-color: #bdbdbd;
}

.pandoraKartaRow {
	display: table-row;
}

.pandoraKartaSec {
	display: none;
}

.pandoraKartaCol {
	vertical-align: top;
	text-align: right;

	color: #444444;
}

.pandoraKartaVal {
	vertical-align: top;
	padding-left: 2px;

	font-weight: bold;
	background-color: #fdfdfd;

	border-style: none none solid solid;
	border-width: 1px;
	border-color: #e4e4e4;
}

/******************************************************************************/

.pandoraPaleta {
	position: relative;
	display: inline-block;

	margin: 4px;
	padding: 4px;
	text-align: center;

	background-color: tan;
	background-color: tomato;
	background-color: teal;
	background-color: seagreen;
	background-color: indianred;
	background-color: darkslategrey;
	background-color: wheat;
	background-color: cadetblue;
	background-color: darkgray;

	border-style: solid;
	border-width: 1px;
	border-color: grey;
	border-radius: 10px;
}

.pandoraPaletaInput {
	visibility: hidden;
	position: absolute;
	top: 0;
	left: 0;
	width: 0px;
	height: 0px;
	font-size: 0px;
}

.pandoraPaletaInputVisible {
	visibility: visible;
	position: relative;
	top: auto;
	left: auto;

	width: 97%;
	height: auto;
	font-size: 12px;

	border-radius: 5px;
}

.pandoraPaletaGrami {
	display: block;
	white-space: nowrap;
	text-align: center;
}

.pandoraPaletaGramiTools {
	display: block;
}

.pandoraPaletaPliktroContainer {
	display: inline-block;
	padding: 2px 4px;
}

.pandoraPaletaPliktro {
	padding: 2px;

	width: 32px;
	height: 32px;
	text-align: center;
	vertical-align: middle;

	font-size: 30px;
	font-family: 'Garamont', serif;
	font-weight: bold;

	color: #1f3750;
	background-color: ivory;
	text-shadow: 1px 1px 2px #888;

	border-style: outset;
	border-width: 2px;
	border-color: grey;
	border-radius: 6px;

	cursor: pointer;

	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.pandoraPaletaPliktroSpecial {
	width: auto;
	margin: 0px 2px;
	padding: 2px 12px;

	background-color: palegoldenrod;
}

/******************************************************************************/

.pandoraPaletaKeyboardStripteaseKey {
	width: auto;
}

.pandoraPaletaSpaceKey {
	font-family: "Roboto Condensed", monospace;
	font-weight: normal;

	width: 3em;
	margin: 2px 0px;
	background-color: ivory;
}

.pandoraPaletaKeyboardSwitchKey {
	font-family: monospace;
	color: maroon;
}

.pandoraPaletaZoomModeKey {
	width: 30px;
	color: darkolivegreen;
}

.pandoraPaletaBackspaceKey {
	color: #193a37;
}

.pandoraPaletaClearKey {
	color: red;
}

.pandoraPaletaRecallKey {
	color: blue;
}

.pandoraPaletaSubmitKey {
	color: midnightblue;
}

/******************************************************************************/

.pandoraPaletaPliktroHover {
	color: #1d0808;
	text-shadow: 1px 1px 0px #563813;
	background-color: #ffffbe;
	box-shadow: 1px 1px 1px #4f1f9c, -1px -1px 1px #72709a;
}

.pandoraPaletaMonitor {
	margin: 4px;
	padding: 2px;

	min-height: 36px;
	text-align: left;

	font-size: 30px;
	font-family: 'Garamont', serif;
	font-weight: bold;

	background-color: ivory;

	border-style: outset;
	border-width: 2px;
	border-color: grey;
	border-radius: 6px;

	cursor: pointer;
}

.pandoraPaletaMonitorScrambled {
	padding: 12px;
	font-size: 10px;
	letter-spacing: 15px;
	min-height: 16px;

	color: transparent !important;
	text-shadow: 1px 1px 8px black, -1px -1px 8px black,
		1px -1px 8px black, -1px 1px 8px black,
		1px 0px 8px black, 0px 1px 8px black,
		-1px 0px 8px black, 0px -1px 8px black;
}

.pandoraPaletaZoomGrami {
	margin: 4px;
	padding: 2px;

	text-align: left;

	font-size: 30px;
	font-family: 'Roboto Condensed', 'Verdana', sans-serif;
	font-weight: normal;

	background-color: #ffff80;

	border-style: outset;
	border-width: 2px;
	border-color: grey;
	border-radius: 6px;

	cursor: pointer;
}

/*////////////////////////////////////////////////////////////////////////////*/

.pandoraPaletaRafi {
	position: relative;
	margin: 4px;

	text-align: left;

	font-size: 30px;
	font-family: 'Roboto Condensed', 'Verdana', sans-serif;
	font-weight: normal;

	-webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.pandoraPaletaRafiMeTitlo {
	margin-top: 26px;
	padding-top: 20px;
}

.pandoraPaletaRafiContent {
	position: relative;
	overflow-y: hidden;

	text-align: left;
	background-color: palegoldenrod;

	border-style: solid;
	border-width: 1px 2px 2px 1px;
	border-color: grey;
	border-radius: 6px;
}

.pandoraPaletaRafiContentMeTitlo {
	top: -20px;
	padding-top: 20px;
}

.pandoraPaletaRafiTitlos {
	position: absolute;
	top: -20px;
	left: 0px;

	display: inline-block;
	padding: 2px 4px;

	font-size: 26px;
	background-color: palegoldenrod;

	border-style: solid;
	border-width: 1px;
	border-color: gray;
	border-radius: 6px;
}

.pandoraPaletaRafiTitlos:hover {
	padding: 0px 2px;
	color: #002d48;
	background-color: #ffb939;
	text-shadow: 0px 0px 1px #000000;
	border-style: ridge;
	border-color: #ff9f00;
	border-width: 3px;
	box-shadow: 2px 2px 6px #4e4e4e;
	cursor: pointer;
}

/*////////////////////////////////////////////////////////////////////////////*/

.pandoraPaletaCandi {
	font-weight: bold;

	color: #002d48;
	background-color: #ffb939;
}

.pandoraFlip180 {
	transform: rotate(180deg);
}
