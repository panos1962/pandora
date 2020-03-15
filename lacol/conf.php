<?php

///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// php
// @FILETYPE END
//
// @FILE BEGIN
// lacol/conf.php —— Πρότυπο PHP configuration file για το "pandora" module.
// @FILE END
//
// @DESCRIPTION BEGIN
// Αντιγράψτε το παρόν file στο directory "local" οποιασδήποτε εφαρμογής
// προκειμένου να κάνετε χρήση της "pandora" PHP library.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-03-13
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

(function() {
	if (defined("PANDORA_BASEDIR"))
	return TRUE;

	$dir = getenv("PANDORA_BASEDIR");

	if ($dir)
	return define("PANDORA_BASEDIR", $dir);

	return define("PANDORA_BASEDIR", "/var/opt/pandora");
})();

?>
