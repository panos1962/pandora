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
// lib/pandoraCore.php —— Ορίζεται το singleton "pandoraCore" το οποίο
// θα αποτελέσει global namespace για αντικείμενα γενικής χρήσης του
// πακέτου "pandora".
// @FILE END
//
// @DESCRIPTION BEGIN
// Η κλάση "pandoraCore" είναι εφήμερη και θα επεκταθεί στην πορεία στην κλάση
// "pandora" η οποία θα περιέχει αντικείμενα ανάλογα με το αν το πρόγραμμα
// εκτελείται από την πλευρά του server ή του client.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-05-09
// Updated: 2020-05-06
// Updated: 2020-04-28
// Created: 2020-01-16
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

if (!defined("PANDORA_BASEDIR"))
require_once("../local/conf.php");

class pandoraCore {
	private static $init_ok = FALSE;
	public static $db = NULL;

	public static function init_core() {
		if (self::$init_ok)
		return __CLASS__;

		self::$init_ok = TRUE;
		register_shutdown_function('pandoraCore::cleanup');

		return __CLASS__;
	}

	public static function cleanup() {
		if (isset(self::$db)) {
			self::$db->close();
			self::$db = NULL;
		}

		return __CLASS__;
	}

	public static function pathname($s) {
		if (substr($s, 0, 1) === "/")
		return $s;

		return PANDORA_BASEDIR . "/" . $s;
	}

///////////////////////////////////////////////////////////////////////////////@

	public static function database($opts = [
		"dbhost" => "localhost",
		"dbuser" => "pandora",
		"dbname" => "pandora",
	]) {
		$sesami = self::sesamidb_get($opts);

		if ($sesami === FALSE)
		throw new Exception("cannot open database");
		
		self::$db = @new mysqli($opts["dbhost"], $opts["dbuser"],
			$sesami, $opts["dbname"]);

		if (self::$db->connect_errno)
		throw new Exception("database connection failed (" .
			self::$db->connect_error . ")");

		if (!@self::$db->set_charset("utf8"))
		throw new Exception("cannot set character set (database)");

		return __CLASS__;
	}

	// Το file "sesami" πρέπει να βρίσκεται στο subdirectory "private"
	// του "pandora" base directory, και να περιέχει γραμμές με δύο
	// στήλες χωρισμένες μεταξύ τους με tabs. Η πρώτη στήλη περιέχει
	// database user name, ενώ η δεύτερη στήλη περιέχει το αντίστοιχο
	// database user password.
	//
	// Στο αρχείο μπορούν να περιέχονται κενές γραμμές οι οποίες
	// αγνοούνται. Ακόμη, αν σε κάποιες γραμμές υπάρχουν περισσότερες
	// από δύο στήλες, τότε οι επιπλέον στήλες αγνοούνται, επομένως
	// μπορούν να χρησιμοποιηθούν ως σχόλια.

	private static function sesamidb_get($opts) {
		$ulist = file(PANDORA_BASEDIR . "/private/sesamidb",
			FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

		if ($ulist === FALSE)
		return FALSE;

		foreach ($ulist as $s) {
			$a = explode("\t", $s);

			if (count($a) < 2)
			continue;

			if ($a[0] !== $opts["dbuser"])
			continue;

			return $a[1];
		}

		return FALSE;
	}

	// Η μέθοδος "query" δέχεται ως πρώτη παράμετρο ένα SQL query και
	// επιχειρεί να το τρέξει. Αν υπάρξει οποιοδήποτε δομικό πρόβλημα
	// (όχι σχετικό με την επιτυχία ή μη του query), τότε εκτυπώνεται
	// μήνυμα λάθους και το πρόγραμμα σταματά.

	public static function query($query) {
		$result = self::$db->query($query);

		if ($result)
		return $result;

		throw new Exception("SQL ERROR: [" . self::sql_errno() .
			"]: " . $query . ": " . self::sql_error());
	}

	public static function sql_errno() {
		return self::$db->errno;
	}

	public static function sql_error() {
		return self::$db->error;
	}

	// Η μέθοδος "first_row" τρέχει ένα query και επιστρέφει την πρώτη
	// γραμμή των αποτελεσμάτων απελευθερώνοντας τυχόν άλλα αποτελέσματα.

	public static function first_row($query, $idx = MYSQLI_NUM) {
		$result = self::query($query);
		$row = $result->fetch_array($idx);
		$result->free_result();

		return $row;
	}

	public static function insert_id() {
		return self::$db->insert_id;
	}

	public static function affected_rows() {
		return self::$db->affected_rows;
	}

	public static function autocommit($on_off) {
		if (self::$db->autocommit($on_off))
		return __CLASS__;

		throw new Exception("autocommit failed");
	}

	public static function commit() {
		if (self::$db->commit())
		return __CLASS__;

		throw new Exception("commit failed");
	}

	public static function rollback() {
		if (self::$db->rollback())
		return __CLASS__;

		throw new Exception("rollback failed");
	}

	public static function sql_string($s, $quote = "'") {
		if ($quote === FALSE)
		$quote = "";

		return $quote . self::$db->real_escape_string($s) . $quote;
	}

	public static function json_string($s) {
		return json_encode($s,
		JSON_FORCE_OBJECT |
		JSON_UNESCAPED_UNICODE);
	}

	///////////////////////////////////////////////////////////////////////@

	// Στην function που ακολουθεί δεν χρησιμοποιούμε την "filter_var"
	// με "FILTER_VALIDATE_INT" καθώς δεν επιτρέπει ακεραίους που
	// εκκινούν με μηδέν, π.χ. "08", "0003" κλπ.

	public static function is_integer($x, $min = NULL, $max = NULL) {
		if(!preg_match("/^-?\d+$/", $x))
		return FALSE;

		$y = (int)$x;

		if ($y != $x)
		return FALSE;

		if (isset($min) && ($y < $min))
		return FALSE;

		if (isset($max) && ($y > $max))
		return FALSE;

		return TRUE;
	}

	public static function not_integer($x, $min = NULL, $max = NULL) {
		return !self::is_integer($x, $min, $max);
	}

	public static function strpush($s, $add, $sep = " ") {
		if (!isset($s))
		return $add;

		return $s . $sep . $add;
	}

	public static function date2date($date = NULL,
		$from = NULL, $to = NULL) {

		if (!isset($date))
		return NULL;

		if (is_string($date)) {
			$date = DateTime::createFromFormat($from, $date);

			if ($date === FALSE)
			return NULL;

			if (isset($to))
			return $date->format($to);

			return $date;
		}

		if (!($date instanceof DateTime))
		return NULL;

		if (isset($to))
		return $date->format($to);

		return $date;
	}

	public static function null_purge(&$x) {
		foreach ($x as $k => $v) {
			if (!isset($v))
			unset($x[$k]);
		}

		return $x;
	}

	public static function noop($x = NULL) {
		if (!isset($x))
		$x = __CLASS__;

		return $x;
	}
}

pandoraCore::init_core();

?>
