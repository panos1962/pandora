#!/usr/bin/env gawk

BEGIN {
	pd_null = ""	# Control-N

	pd_runmodset()
	pd_ttymsgset()
}

function pd_runmodset(		f, l, a) {
	pd_foreground = 0
	pd_background = 0

	f = "/proc/" PROCINFO["pid"] "/stat"

	if ((getline l < f) <= 0)
	return

	split(l, a, " ")
	pd_foreground = (a[5] == a[8])
	pd_background = !pd_foreground
}

function pd_ttymsgset() {
	if (pd_ttymsgon == "")
	pd_ttymsgon = pd_foreground

	else if (pd_background)
	pd_ttymsgon = 0
}

# Η function "pd_readfile" δέχεται ως παράμετρο το όνομα ενός αρχείου και
# επιστρέφει ως ένα ενιαίο string το περιεχόμενο του αρχείου.
#
# ΣΗΜΕΙΩΣΗ: Αν το αρχείο είναι ήδη ανοικτό και έχουμε διαβάσει μέρος τού
# περιεχομένου, τότε η "pd_readfile" θα επιστρέψει το υπόλοιπο περιεχόμενο.
# Σε κάθε περίπτωση, η "pd_readfile" κλείνει το αρχείο μετά το πέρας τής
# ανάγνωσης του περιεχομένου.
#
# ΠΡΟΣΟΧΗ: Εννοείται ότι η "pd_readfile" δεν είναι καλό να χρησιμοποιείται
# για την ανάγνωση πολύ μεγάλων αρχείων.

function pd_readfile(file,		s, t) {
	while ((getline s <file) > 0)
	t = t s "\n"

	close(file)
	return t
}

# Η function "pd_isnull" δέχεται μια παράμετρο και ελέγχει αν η παράμετρος αυτή
# είναι null οπότε επιστρέφει μηδέν, ενώ αν η παράμετρος δεν είναι null τότε
# επιστρέφει μη μηδενική τιμή.

function pd_isnull(val) {
	return (val == pd_null)
}

function pd_notnull(val) {
	return (val != pd_null)
}

# Η function "pd_nullconvert" επιστρέφει την τιμή τής πρώτης παραμέτρου που τής
# περνάμε, εκτός και αν αυτή είναι null οπότε επιστρέφει την τιμή τής δεύτερης
# παραμέτρου.

function pd_nullconvert(s, t) {
	return (s == pd_null ? t : s)
}

###############################################################################@

# Η function "pd_dt2dt" χρησιμοποιείται για να μετατρέψει ημερομηνίες και ώρες
# από ένα format σε άλλο. Το format εισόδου μπορεί να περιλαμβάνει κάποια από
# τα γράμματα Y, M, D, h, m και s, ενώ το format εξόδου μπορεί να περιέχει και
# άλλους χαρακτήρες που θα περιληφθούν ως έχουν.

function pd_dt2dt(date, from, to,		l1, i, l2, \
	n, f, m, len, c, d, v) {

	# Καθορίζονται τα μήκη των διαφόρων συστατικών
	# στοιχείων ημερομηνίας και ώρας.

	l1["Y"] = 4
	l1["M"] = 2
	l1["D"] = 2
	l1["h"] = 2
	l1["m"] = 2
	l1["s"] = 2

	# Θα χρειαστούμε αντίγραφο της λίστας μηκών.

	for (i in l1)
	l2[i] = l1[i]

	if (!from)
	from = "YMDhms"

	n = split(from, f, "")

	for (i = 1; i <= n; i++) {
		if (!(f[i] in l1))
		return ""

		delete l2[f[i]]
	}

	for (i in l1)
	l2[i] = l1[i]

	# Αν η ημερομηνία/ώρα εισόδου δεν αποτελείται αποκλειστικά από
	# αριθμητικά ψηφία, τότε θα πρέπει τα συστατικά που δηλώθηκαν
	# στο format εισόδου να χωρίζονται μεταξύ τους με strings που
	# δεν περιέχουν αριθμητικά ψηφία.

	if (date !~ /^[0-9]+$/) {
		if ((m = split(date, v, /[^0-9]/)) > n)
		return ""

		if (m < 1)
		return ""

		for (i = 1; i <= m; i++) {
			if (v[i] !~ /^[0-9]+$/)
			return ""

			d[f[i]] = v[i]
		}

		if (!to)
		to = "YMDhms"

		return pd_dt2dt_to(d, to, l2)
	}

	# Αν η ημερομηνία/ώρα εισόδου αποτελείται μόνο από αριθμητικά ψηφία,
	# τότε αποσπούμε τα συστατικά της με βάση το input format και τα μήκη
	# των αντίστοιχων συστατικών.

	len = length(date)

	for (i = 1; i <= n; i++) {
		c = f[i]

		if (l1[c] > len)
		return ""

		d[c] = substr(date, 1, l1[c]) + 0
		date = substr(date, l1[c] + 1)

		len -= l1[c]

		if (!len)
		break

		delete l1[c]
	}

	if (len)
	return ""

	if (!to)
	to = "Y-M-D h:m:s"

	return pd_dt2dt_to(d, to, l2)
}

function pd_dt2dt_to(date, to, l,		len, i, c, s, t) {
	len = length(to)

	for (i = 1; i <= len; i++) {
		c = substr(to, i, 1)

		if (!(c in l)) {
			t = t c
			continue
		}

		if (!(c in date))
		return ""

		s = s sprintf("%s%0" l[c] "d", t, date[c])

		t = ""
		delete l[c]
	}

	return s
}

function pd_integerck(x, min, max) {
	if (x !~ /^[0-9]+$/)
	return 1

	if ((min != "") && (x < min))
	return 2

	if ((max != "") && (x > max))
	return 3

	return 0
}

function pd_isinteger(x) {
	return (x ~ /^[0-9]+$/)
}

function pd_notinteger(x) {
	return !pd_isinteger(x)
}

###############################################################################@

function pd_aclone(target, source,		i) {
	delete target

	target[""]
	delete target[""]

	if (!isarray(source))
	pd_fatal("pd_aclone: source is not an array")

	for (i in source) {
		if (isarray(source[i]))
		pd_aclone(target[i], source[i])

		else
		target[i] = source[i]
	}
}

function pd_aprint(a, s,		i) {
	if (!isarray(a))
	return

	for (i in a) {
		if (!isarray(a[i])) {
			print s ":" i ": >>" a[i] "<<"
			continue
		}

		print s "[" i "]"
		pd_aprint(a[i], s "\t")
	}
}

###############################################################################@

function pd_errmsg(s, nonl) {
	if (pd_progname)
	printf "%s: ", pd_progname >"/dev/stderr"

	printf "%s", s >"/dev/stderr"

	if (!nonl)
	print "" >"/dev/stderr"

	return 1
}

function pd_fatal(msg, stat) {
	if (msg)
	pd_errmsg(msg)

	exit(stat ? stat : 1)
}

function pd_ttymsg(s, nonl) {
	if (!pd_ttymsgon)
	return

	if (!pd_foreground)
	return

	printf "%s", s >"/dev/tty"

	if (!nonl)
	print "" >"/dev/tty"
}

###############################################################################@

BEGIN {
	srand()
}

function pd_nrand(from, to) {
	return from + int(rand() * (to - from + 1))
}

function pd_srand(len, paleta,			plen, i, s) {
	if (!paleta)
	paleta = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" \
		"abcdefghijklmnopqrstuvwxyz" \
		"0123456789"

	plen = length(paleta)

	while (len-- > 0)
	s = s substr(paleta, pd_nrand(0, plen), 1)

	return s
}

function pd_passgen(l1, l2, paleta) {
	if (!l1)
	l1 = 8

	if (!l2)
	l2 = l1 + pd_nrand(4, 8)

	if (!paleta)
	paleta = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" \
		"abcdefghijklmnopqrstuvwxyz" \
		"0123456789"

	return pd_srand(pd_nrand(l1, l2), paleta)
}

function pd_sha1gen(s,			cmd, x, a) {
	if (!s)
	s = pd_passgen()

	cmd = sprintf("echo -n '%s' | sha1sum", s)
	cmd | getline x
	close(cmd)
	split(x, a, " ")

	return a[1]
}

# Η function "pd_isempty" ελέγχει αν το array που περνάμε ως παράμετρο είναι
# κενό και επιστρέφει 1, αλλιώς επιστρέφει 0.

function pd_isempty(list,			i) {
	for (i in list)
	return 0

	return 1
}

function pd_notempty(list) {
	return !pd_isempty(list)
}
