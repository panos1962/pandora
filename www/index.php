<?php
///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// php
// @FILETYPE END
//
// @FILE BEGIN
// www/index.php —— Αρχική σελίδα πακέτου "pandora"
// @FILE END
//
// @HISTORY BEGIN
// Updated: 2020-01-16
// Created: 2010-12-25
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../local/conf.php");
require_once(PANDORA_BASEDIR . "/lib/pandoraClient.php");

pandora::
document_head([
	"fonts" => [
		"Vollkorn+SC:400,600,700,900",
		"Roboto+Condensed",
	],
])::
document_body()::
document_close();
?>
