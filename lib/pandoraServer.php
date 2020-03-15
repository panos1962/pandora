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
// lib/pandoraServer.php —— Ορίζεται το singleton "pandora" το οποίο αποτελεί
// global namespace για αντικείμενα γενικής χρήσης του πακέτου "pandora".
// @FILE END
//
// @DESCRIPTION BEGIN
// Η κλάση "pandora" επεκτείνει την κλάση "pandoraCore" με δομές του "pandora"
// module που αφορούν σε εκτέλεση PHP προγραμμάτων απευθείας στον server.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-03-13
// Created: 2020-02-03
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

if (!defined("PANDORA_BASEDIR"))
require_once("../local/conf.php");

if (!class_exists("pandoraCore"))
require_once(PANDORA_BASEDIR . "/lib/pandoraCore.php");

class pandora extends pandoraCore {
	private static $init_ok = FALSE;

	public static function init() {
		if (self::$init_ok)
		return __CLASS__;

		self::$init_ok = TRUE;
		return __CLASS__;
	}
}

pandora::init();

?>
