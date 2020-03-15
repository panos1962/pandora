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
// lib/pandoraClient.php —— Ορίζεται το singleton "pandora" το οποίο αποτελεί
// global namespace για αντικείμενα γενικής χρήσης του πακέτου "pandora".
// @FILE END
//
// @DESCRIPTION BEGIN
// Η κλάση "pandora" επεκτείνει την κλάση "pandoraCore" με δομές του "pandora"
// module που αφορούν σε εκτέλεση PHP προγραμμάτων στον client.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-03-13
// Updated: 2020-02-10
// Updated: 2020-01-29
// Updated: 2020-01-16
// Updated: 2020-01-11
// Updated: 2019-12-31
// Updated: 2019-12-30
// Updated: 2019-12-26
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

if (!defined("PANDORA_BASEDIR"))
require_once("../local/conf.php");

if (!class_exists("pandoraCore"))
require_once(PANDORA_BASEDIR . "/lib/pandoraCore.php");

// Για να καθορίσουμε αν έχουμε επώνυμη ή ανώνυμη χρήση σε client προγράμματα
// ελέγχουμε το session attribute "pandora_xristis"· αν το εν λόγω session
// attribute έχει τεθεί τότε σημαίνει ότι έχουμε επώνυμη χρήση, αλλιώς έχουμε
// ανώνυμη χρήση. Επιπλέον, όταν έχουμε επώνυμη χρήση μπορούμε να θέτουμε και
// το session attribute "pandora_xridos" το οποίο μπορεί να δείχνει το είδος
// του χρήστη στην περίπτωση που χρησιμοποιούμε περισσότερες από μια μεθόδους
// πιστοποίησης, π.χ. είσοδος ως δημοτικός αστυνομικός, είσοδος ως υπάλληλος,
// είσοδος ως γενικός χρήστης κλπ. Σ' αυτήν την περίπτωση θέτουμε το session
// attribute "pandora_xridos" στο είδος χρήστη, δηλαδή εξηγούμε τη σημασία
// της τιμής του "pandora_xristis" session attribute, π.χ. αν έχουμε εισέλθει
// με τον κωδικό του δημοτικού αστυνομικού η τιμή του session attribute
// "pandora_xristis" μπορεί να είναι "Α198", ενώ η τιμή του session attribute
// "pandora_xridos" θα είναι "dimas" που σημαίνει ότι η τιμή "Α198" είναι
// κωδικός δημοτικού αστυνομικού. Αν έχουμε εισέλθει με τον αριθμό μητρώου
// υπαλλήλου η τιμή του session attribute "pandora_xristis" μπορεί να είναι
// "3307", ενώ η τιμή του session attribute "pandora_xridos" θα είναι
// "ipalilos". Αν τέλος ο χρήστης έχει εισέλθει ως εξωτερικός χρήστης
// η τιμή του session attribute "pandora_xristis" μπορεί να είναι "panos",
// ενώ η τιμή του session attribute "pandora_xridos" θα είναι "xristis".
// Αν έχουμε μόνο μια μέθοδο πιστοποίησης, τότε δεν υπάρχει ανάγκη να τεθεί
// το session attribute "pandora_xridos".

define("PANDORA_SESSION_XRISTIS", "pandora_xristis");
define("PANDORA_SESSION_XRIDOS", "pandora_xridos");

class pandora extends pandoraCore {
	private static $init_ok = FALSE;
	public static $protocol = NULL;
	public static $host = NULL;
	public static $www = NULL;

	public static function init() {
		if (self::$init_ok)
		return __CLASS__;

		self::$protocol = "http";

		if (array_key_exists("HTTPS", $_SERVER) &&
		(strtoupper($_SERVER["HTTPS"]) !== "OFF"))
		self::$protocol .= "s";

		self::$protocol .= "://";
		self::$host = self::$protocol . $_SERVER["HTTP_HOST"];
		self::$www = self::$host . "/pandora";

		return __CLASS__;
	}

	// Η function "www" δέχεται ως παράμετρο ένα pathname και το
	// επιστρέφει ως "pandora" url.

	public static function www($s = NULL) {
		if (!isset($s))
		return self::$www;

		$t = self::$www;

		if (substr($s, 0, 1) !== "/")
		$t .= "/";

		return $t . $s;
	}

	// Η function "www_print" δέχεται ως παράμετρο ένα pathname και το
	// εκτυπώνει ως "pandora" url.

	public static function www_print($s = NULL) {
		print self::www($s);
		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	public static function parameter_get($tag, $arr = NULL) {
		if (!isset($arr))
		$arr = $_REQUEST;

		if (!is_array($arr))
		return NULL;

		return (array_key_exists($tag, $arr) ? $arr[$tag] : NULL);
	}

	public static function post_get($tag) {
		return self::parameter_get($tag, $_POST);
	}

	public static function get_get($tag) {
		return self::parameter_get($tag, $_GET);
	}

	public static function request_get($tag) {
		return self::parameter_get($tag, $_REQUEST);
	}

	public static function parameter_yes($tag, $arr = NULL) {
		if (!isset($arr))
		$arr = $_REQUEST;

		if (!is_array($arr))
		return FALSE;

		if (!array_key_exists($tag, $arr))
		return FALSE;

		switch (strtoupper($arr[$tag])) {
		case "OFF":
		case "NO":
		case "0":
			return FALSE;
		}

		return TRUE;
	}

	///////////////////////////////////////////////////////////////////////@

	// Η private function "document_head_opts" δέχεται ως παράμετρο μια
	// λίστα από options που αφορούν σε διάφορα στοιχεία που εμπλέκονται
	// στο head section της σελίδας, π.χ. title, favicon, css files,
	// javascript files κλπ. Τα στοιχεία της λίστας μπορούν να φέρουν
	// διαφόρων ειδών τιμές:
	//
	//	TRUE	Σημαίνει ότι θα ακολουθηθεί η default διαδικασία για
	//		το συγκεκριμένο στοιχείο.
	//
	//	string	Το συγκεκριμένο string θα χρησιμοποιηθεί ως τιμή του
	//		συγκεκριμένου στοιχείου.
	//
	//	array	Θα χρησιμοποιηθούν οι τιμές που δίνονται στο array.

	private static function document_head_opts($opts = NULL) {
		$stpo = [
			"title" => "pandora",
			"favicon" => TRUE,
			"fonts" => [
				"Roboto+Slab",		// serif
				"Roboto+Condensed",	// sans-serif
				"Roboto+Mono",		// monospace
				"Vollkorn",		// serif
			],
			"css" => TRUE,
			"jQuery" => [
				"core" => TRUE,
				"ui" => TRUE,
			],
		];

		if (isset($opts)) {
			foreach ($opts as $key => $val)
			$stpo[$key] = $val;
		}

		return $stpo;
	}

	public static function document_head($opts = NULL) {
		$opts = self::document_head_opts($opts);

?>
<!DOCTYPE html>
<html>
<head>
<?php

		self::
		title($opts)::
		favicon($opts)::
		css($opts)::
		fonts($opts)::
		jQuery($opts)::
		noop();

		return __CLASS__;
	}

	private static function extract_option($arr, $key) {
		if (!array_key_exists($key, $arr))
		return FALSE;

		$opt = $arr[$key];

		if (!isset($opt))
		return FALSE;

		if (is_array($opt))
		return $opt;

		return $opt;
	}

	///////////////////////////////////////////////////////////////////////@

	private static function title($opts) {
		$title = self::extract_option($opts, "title");

		if (!$title)
		return __CLASS__;

		print "<title>" . $title . "</title>";
		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	private static function get_favicon($opts) {
		$favicon = self::extract_option($opts, "favicon");

		if (!$favicon)
		return FALSE;

		if ($favicon !== TRUE)
		return $favicon;

		foreach ([ "png", "gif", "ico" ] as $x) {
			$f = "favicon." . $x;

			if (@stat($f))
			return $f;
		}

		return FALSE;
	}

	private static function favicon($opts) {
		$favicon = self::get_favicon($opts);

		if (!$favicon)
		return __CLASS__;

		$parts = explode(".", $favicon);

		if (($n = count($parts)) < 2)
		return __CLASS__;

		switch (strtoupper($parts[$n - 1])) {
		case "ICO":
			$type = '';
			break;
		case "PNG":
			$type = 'type="image/png"';
			break;
		case "GIF":
			$type = 'type="image/gif"';
			break;
		default:
			return __CLASS__;
		}

?>
<link rel="icon" <?php print $type; ?> href="<?php print $favicon; ?>">
<?php

		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	private static function fonts($opts) {
		if (($flist = self::extract_option($opts, "fonts")) === FALSE)
		return __CLASS__;

		if (!count($flist))
		return __CLASS__;

?>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=<?php
		print array_splice($flist, 0, 1)[0];

		foreach ($flist as $font)
		print "|" . $font;
?>&subset=greek">
<?php
		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	private static function css($opts) {
		$extras = [
			"",
			"Print",
		];

		if (pandora::parameter_yes("debug"))
		$extras[] = "Debug";

		$slist = self::extract_option($opts, "css");

		if ($slist === FALSE)
		$slist = [];

		elseif ($slist === TRUE)
		$slist = [ "main" ];

		elseif (!is_array($slist))
		$slist = [ $slist ];

		foreach ($slist as $css) {
			foreach ($extras as $post) {
				$f = $css . $post . ".css";

				if (!@stat($f))
				continue;

				$f .= "?mtime=" . filemtime($f);

				switch ($post) {
				case 'Print':
					$media = 'media="print"';
					break;
				default:
					$media = '';
					break;
				}
?>
<link rel="stylesheet" <?php print $media; ?> href="<?php print $f; ?>">
<?php
			}
		}

		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	private static function jQuery($opts) {
		$mlist = self::extract_option($opts, "jQuery");

		if (!$mlist)
		return __CLASS__;

?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<?php

		if (array_key_exists("ui", $mlist) && $mlist["ui"]) {
?>
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
<?php
		}

		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	public static function document_body() {
?>
</head>
<body>
<?php
		return __CLASS__;
	}

	public static function document_close($opts = NULL) {
		$stpo = [
			"jspass" => [
				"_SERVER" => [
					"SERVER_ADDR" => TRUE,
					"SERVER_NAME" => TRUE,
					"HTTP_HOST" => TRUE,
					"HTTPS" => TRUE,
					"REQUEST_URI" => TRUE,
					"PHP_SELF" => TRUE,
					"QUERY_STRING" => TRUE,
				],
				"_GET" => TRUE,
				"_POST" => TRUE,
				"defs" => TRUE,
			],
			"script" => TRUE,
		];

		if (isset($_SESSION) && is_array($_SESSION))
		$stpo["jspass"]["_SESSION"] = TRUE;

		if (isset($opts)) {
			foreach ($opts as $key => $val)
			$stpo[$key] = $val;
		}

		self::
		jspass($stpo)::
		script($stpo)::
		noop();
?>
</body>
</html>
<?php
		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	private static function jspass($opts) {
		$alist = self::extract_option($opts, "jspass");

		if (!$alist)
		return __CLASS__;

		if (array_key_exists("defs", $alist) && $alist["defs"])
		$defs = get_defined_constants(TRUE)["user"];

?>
<script>
const php = {};
<?php
		foreach ($alist as $name => $ilist) {
			if (!$ilist)
			continue;

			@eval("\$array = \$" . $name . ";");

			if (is_array($array))
			self::jspassa($name, $array, $ilist);
		}
?>
</script>
<?php
		return __CLASS__;
	}

	private static function jspassa($name, $array, $ilist) {
		print "php." . $name . " = {" . PHP_EOL;

		foreach ($array as $key => $val) {
			if (($ilist === TRUE) || @$ilist[$key])
			print "\t" . self::jspass_strip($key) . ":" .
				self::jspass_strip($val) . ",\n";
		}

		print "};\n";
	}

	private static function jspass_strip($x) {
		return '"'.addslashes(str_replace(
			["\n", "\r"],
			["\\n", "\\r"],
			$x
		)).'"';
	}

	///////////////////////////////////////////////////////////////////////@

	private static function script($opts) {
		$slist = self::extract_option($opts, "script");

		if (!$slist)
		return __CLASS__;

		// Αν δεν έχουν δοθεί συγκεκριμένα script names αλλά έχει
		// καθοριστεί συμπερίληψη των default scripts, τότε ελέγχουμε
		// αν υπάρχει "bundle.js" ή "main.js" με αυτή τη σειρά.

		if ($slist === TRUE) {
			foreach ([ "bundle", "main" ] as $script) {
				$f = $script . ".js";

				if (!@stat($f))
				continue;

				$slist = $script;
				break;
			}

			// Αν δεν βρέθηκαν default scripts τότε δεν προχωρούμε
			// σε συμπερίληψη scripts.

			if ($slist === TRUE)
			return __CLASS__;

		}

		// Αν έχει εντοπιστεί default script ή έχει δοθεί ένα script
		// ως script name, τότε δημιουργούμε array με ένα μόνο script.

		if (!is_array($slist))
		$slist = [ $slist ];

		foreach($slist as $script) {
			$script .= ".js"
?>
<script src="<?php print $script . "?" . filemtime($script); ?>"></script>
<?php
		}

		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	private static $session_ok = FALSE;

	public static function session_init() {
		if (self::$session_ok)
		return __CLASS__;

		session_start();
		self::$session_ok = TRUE;

		return __CLASS__;
	}
		
	public static function session_clear($key = NULL) {
		if (!isset(self::$session_ok))
		self::session_init();

		if (!isset($_SESSION))
		return __CLASS__;

		if (!is_array($_SESSION))
		return __CLASS__;

		if (!isset($key)) {
			foreach ($_SESSION as $key)
			unset($_SESSION[$key]);

			return __CLASS__;
		}

		unset($_SESSION[$key]);
		return __CLASS__;
	}

	public static function session_set($key = NULL, $val = NULL) {
		if (!isset(self::$session_ok))
		self::session_init();

		if (!isset($_SESSION))
		return __CLASS__;

		if (!is_array($_SESSION))
		return __CLASS__;

		if (!isset($key))
		return __CLASS__;

		if (!isset($val)) {
			self::session_clear($key);
			return __CLASS__;
		}

		$_SESSION[$key] = $val;
		return __CLASS__;
	}

	public static function session_get($key = NULL) {
		if (!isset(self::$session_ok))
		self::session_init();

		if (!isset($_SESSION))
		return NULL;

		if (!is_array($_SESSION))
		return NULL;

		if (!isset($key))
		return NULL;

		if (array_key_exists($key, $_SESSION))
		return $_SESSION[$key];

		return NULL;
	}

	public static function is_session($key = NULL) {
		return self::session_get($key);
	}

	///////////////////////////////////////////////////////////////////////@


	public static function header_data() {
		header("Content-type: text/plain; charset=utf-8");
		return __CLASS__;
	}

	public static function header_json() {
		header("Content-Type: application/json; charset=utf-8");
		return __CLASS__;
	}

	public static function header_html() {
		header("Content-type: text/html; charset=utf-8");
		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	public static function xristis_get() {
		return self::session_get(PANDORA_SESSION_XRISTIS);
	}

	public static function is_xristis() {
		return self::xristis_get();
	}

	public static function no_xristis() {
		return !self::is_xristis();
	}

	public static function xridos_get() {
		return self::session_get(PANDORA_SESSION_XRIDOS);
	}

	// Η function "is_xridos" ελέγχει αν ο χρήστης έχει πιστοποιηθεί με
	// συγκεκριμένο τρόπο. Επί παραδείγματι, σε κάποια εφαρμογή ο χρήστης
	// μπορεί να πιστοποιηθεί ως δημοτικός αστυνομικός ("dimas"), ή ως
	// υπάλληλος ("ipalilos"), ή ως εξωτερικός χρήστης ("xristis"). Αν
	// υποθέσουμε ότι έχουμε ελέγξει την επώνυμη χρήση και διαπιστώσαμε
	// ότι το session attribute "pandora_xristis" έχει την τιμή "Α198",
	// τότε θα πρέπει να προχωρήσουμε στον έλεγχο της μεθόδου πιστοποίησης
	// προκειμένου να προσπελάσουμε τον χρήστη. Πράγματι, αν το session
	// attribute "pandora_xridos" έχει τιμή "dimas" τότε σημαίνει ότι το
	// "Α198" είναι κωδικός δημοτικού αστυνομικού, ενώ αν το session
	// "pandora_xridos" έχει τιμή "xristis" τότε σημαίνει ότι το "Α198"
	// είναι το login name εξωτερικού χρήστη της εφαρμογής:
	//
	//	...
	//	$xristis = pandora::$xristis_get();
	//
	//	if (!$xristis)
	//	return;
	//
	//	if (pandora::is_xridos("dimas"))
	//	$xristis = dimotikos_astinomos_get($xristis);
	//
	//	elseif (pandora::is_xridos("ipalilos"))
	//	$xristis = dimotikos_ipalilos_get($xristis);
	//
	//	else
	//	$xristis = xristis_get($xristis);
	//	...

	public static function is_xridos($idos = NULL) {
		$xridos = self::session_get(PANDORA_SESSION_XRIDOS);

		if (!$xridos)
		return FALSE;

		if (isset($idos))
		return ($xridos === $idos);

		return TRUE;
	}
}

pandora::init();

?>
