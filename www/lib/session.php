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
// www/lib/session.php —— Πρόγραμμα ενημέρωσης των session cookies
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν καλείται προκειμένου να ενημερώσουμε στοιχεία των session cookies.
// Πιο συγκεκριμένα, δέχεται μια λίστα από key, value pairs και ενημερώνει τα
// αντίστοιχα στοιχεία της λίστας "_SESSION".
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-04-15
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once("pandora.php");

pandora::session_init();

if (!pandora::post_get("list"))
exit(0);

if (!is_array($_POST["list"]))
exit(0);

if (pandora::post_get("unset")) {
print $key;
	foreach ($_POST["list"] as $key => $val)
	unset($_SESSION[$key]);
}

else {
	foreach ($_POST["list"] as $key => $val)
	$_SESSION[$key] = $val;
}

exit(0);
