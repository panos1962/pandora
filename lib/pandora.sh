#!/usr/bin/env bash

# Η ανά χείρας βιβλιοθήκη περιέχει bash functions που μπορούν να διευκολύνουν
# τη γραφή bash scripts. Για να περιλάβετε τη βιβλιοθήκη σε κάποιο bash script
# μπορείτε να ακολουθήσετε το παρακάτω παράδειγμα:
#
#	#!/usr/bin/env bash
#
#	. "${PANDORA_BASEDIR:=/var/opt/pandora}/lib/pandora.sh ||
#	exit 2
#	...
#
# Με άλλα λόγια μπορείτε να ξεκινάτε με τη συμπερίληψη της βιβλιοθήκης. Εάν
# υπάρχει ορισμένη στο environment η μεταβλητή "PANDORA_BASEDIR", τότε μπορείτε
# απλά να γράψετε:
#
#	#!/usr/bin/env bash
#
#	. "${PANDORA_BASEDIR}/lib/pandora.sh ||
#	exit 2
#	...

################################################################################

# Αρχικά θέτουμε την μεταβλητή "pd_loaded" ώστε εάν, παρ' ελπίδα, έχουμε ήδη
# συμπεριλάβει τη βιβλιοθήκη "pandora", άμεσα η έμμεσα, στο τρέχον bash script,
# να μην τη συμπεριλάβουμε για δεύτερη φορά.

[ -n "${pd_loaded}" ] &&
pd_debugmsg "pandora's box has already been opened! (${pd_loaded})" >&2 &&
return 0

# Η function "pd_gps" εκτυπώνει στο standard output το όνομα του τρέχοντος bash
# script και την τρέχουσα γραμμή, με άλλα λόγια μας λέει πού βρισκόμαστε καθώς
# εκτελείται ένα bash script.

pd_gps() {
	local gps=

	[ -n "${BASH_SOURCE[$((${#BASH_SOURCE[@]}-1))]}" ] &&
	gps="${BASH_SOURCE[$((${#BASH_SOURCE[@]}-1))]} "

	gps="${gps}[line: ${BASH_LINENO[$((${#BASH_LINENO[@]}-2))]}]"

	echo "${gps}"
}

# Θέτουμε την μεταβλητή "pd_loaded" και φροντίζουμε να δώσουμε ως τιμή κάποια
# πληροφορία θα μπορούσε, ίσως, να μας φανεί χρήσιμη στο debugging. Πιο
# συγκεκριμένα, θέτουμε ως τιμή της "pd_loaded" το τρέχον bash script και τον
# αριθμό της τρέχουσας γραμμής, ώστε να γνωρίζουμε σε ποιο σημείο έχουμε
# συμπεριλάβει τη βιβλιοθήκη για πρώτη φορά.

pd_loaded="$(pd_gps)"

# Η global μεταβλητή "pd_debugaa" χρησιμοποιείται κατά την αποσφαλμάτωση
# μέσω της function "pd_debugmsg". Πράγματι, αν δεν δοθεί μήνυμα προς εκτύπωση
# στην "pd_debugmsg" ή το μήνυμα είναι κενό, τίοτε εκτυπώνεται dummy message
# το οποίο περιέχει την τρέχουσα τιμή τού μετρητή "pd_debugaa", αφού
# προηγουμένως την αυξήσει κατά ένα.

pd_debugaa=0

# Η function "pd_debugmsg" δέχεται ως πρώτη παράμετρο ένα string το οποίο
# εκτυπώνει στο standard output. Αν αναρωτηθείτε γιατί προτιμήθηκε το
# standard output από το standard error, η απάντηση είναι ότι κάποιες φορές
# χρειαζόμαστε τα μηνύματα αποσφαλμάτωσης να εμφανίζονται ανάμεσα στα
# αποτελέσματα. Αν επιθυμούμε τα μηνύματα αποσφαλμάτωσης να εκτυπωθούν στο
# standard error, τότε απλώς επανακατευθύνουμε το output της "pd_debugmsg"
# στο standard error.

pd_debugmsg() {
	[ -z "${pd_debug}" ] &&
	return 0

	echo -n "$(pd_gps): "

	[ -n "$1" ] &&
	echo "$1" &&
	return 0

	echo ">> DEBUG ($((++pd_debugaa))) <<"
	return 0
}

# Οι functions που ακολουθούν είναι συντομογραφίες της "pd_debugmsg" και
# μπορούν να χρησιμοποιηθούν για γρήγορη αποσφαλμάτωση, απλώς εμφυτεύοντας
# κατάλληλες κλήσεις των εν λόγω functions σε κομβικά σημεία του κώδικα και
# μάλιστα οι κλήσεις αυτές συνήθως στερούνται μηνύματος, οπότε εκτυπώνεται
# η τρέχουσα τιμή του μετρητή αποσφαλμάτωσης "pd_debugaa".

# Η function "pd_dout" είναι συντομογραφία της "pd_debugmsg" όπου το debug
# message κατευθύνεται προς το standard output.

pd_dout() {
	pd_debugmsg "$@"
}

# Η function "pd_derr" είναι συντομογραφία της "pd_debugmsg" όπου το debug
# message κατευθύνεται προς το standard error.

pd_derr() {
	pd_debugmsg "$@" >&2
}

################################################################################

# Θέτουμε ορισμένες βασικές global μεταβλητές, όπως είναι το πλήρες όνομα του
# προγράμματος, το όνομα του προγράμματος απαλλαγμένο από το path, τα arguments
# τού command line κλπ.

pd_progfull="$0"
pd_progname="${pd_progfull##*/}"
pd_progpath="${pd_progfull%/${pd_progname}}"
pd_progargs="$@"

# Παράδειγμα:
#
#	/var/opt/kartel/bin/myprogram -x -y panos maria
#
#	pd_progfull: /var/opt/kartel/bin/myprogram
#	pd_progname: myprogram
#	pd_progpath: /var/opt/kartel/bin
#	pd_progargs: -x -y panos maria

unset pd_foreground
unset pd_background

# Η function "pd_isforeground" επιστρέφει μηδέν εφόσον το πρόγραμμά μας τρέχει
# στο foreground, αλλιώς επιστρέφει μη μηδενική τιμή. Ο έλεγχος γίνεται μεταξύ
# του process group ID του προγράμματος και του ID τού foreground process group
# τού controlling terminal τού προγράμματος. Στα foreground processes τα δύο
# group IDs συμπίπτουν, ενώ στα background processes είναι διαφορετικά.

pd_isforeground() {
	set -- $(</proc/$$/stat)
	[ $5 -eq $8 ] &&
	pd_foreground="yes" &&
	pd_background=
}

# Η function "pd_isbackground" επιστρέφει μηδέν εφόσον το πρόγραμμά μας τρέχει
# στο background, αλλιώς επιστρέφει μη μηδενική τιμή.

pd_isbackground() {
	set -- $(</proc/$$/stat)
	[ $5 -ne $8 ] &&
	pd_background="yes" &&
	pd_foreground=
}

pd_isforeground

################################################################################

# Το section που ακολουθεί έχει να κάνει με τον «καλλωπισμό» τού output όταν
# αυτό κατευθύνεται σε τερματικό. Μιλάμε για το standard output ή το standard
# error, όπου μπορούμε να προσθέσουμε χρώμα ή άλλα «καλούδια» προκειμένου το
# τα αποτελέσματα ή τα μηνύματα λαθών να είναι περισσότερο ευανάγνωστα από τον
# χρήστη ή τον προγραμματιστή.

unset pd_ttyattr
declare -A pd_ttyattr

# Χρησιμοποιούμε προσωρινά την function "pd_tput" προκειμένου να καταχωρήσουμε
# στο array "pd_ttyattr" τα διάφορα terminal attributes που θα χρησιμοποιήσουμε
# στην "pandora".

pd_tput() {
	pd_ttyattr["reset"]="$(tput sgr0)"
	pd_ttyattr["bold"]="$(tput bold)"
	pd_ttyattr["dim"]="$(tput setaf 7; tput dim)"

	pd_ttyattr["fblack"]="$(tput setaf 0)"
	pd_ttyattr["bblack"]="$(tput setab 0)"

	pd_ttyattr["fred"]="$(tput setaf 1)"
	pd_ttyattr["bred"]="$(tput setab 1)"

	pd_ttyattr["fgreen"]="$(tput setaf 2)"
	pd_ttyattr["bgreen"]="$(tput setab 2)"

	pd_ttyattr["fyellow"]="$(tput setaf 3)"
	pd_ttyattr["byellow"]="$(tput setab 3)"

	pd_ttyattr["fblue"]="$(tput setaf 4)"
	pd_ttyattr["bblue"]="$(tput setab 4)"

	pd_ttyattr["fmagenta"]="$(tput setaf 5)"
	pd_ttyattr["bmagenta"]="$(tput setab 5)"

	pd_ttyattr["fcyan"]="$(tput setaf 6)"
	pd_ttyattr["bcyan"]="$(tput setab 6)"

	pd_ttyattr["fwhite"]="$(tput setaf 7)"
	pd_ttyattr["bwhite"]="$(tput setab 7)"

	pd_ttyattr["errfile"]="$(tput sgr0; tput setaf 1; tput bold)"
	pd_ttyattr["errline"]="$(tput sgr0; tput setaf 4)"
	pd_ttyattr["errlineno"]="$(tput sgr0; tput setaf 6; tput bold)"
	pd_ttyattr["errmsg"]="$(tput sgr0; tput setaf 3; tput bold)"
}

# Εάν το standard output ή το standard error είναι τερματικό, θέτουμε τα
# terminal attributes στο array "pd_ttyattr", αλλιώς δεν μπαίνουμε στον κόπο
# καθώς τα εν λόγω attributes δεν θα μας χρειαστούν.

[ -n "${pd_foreground}" ] &&
[ \( -t 1 \) -o \( -t 2 \) ] &&
pd_tput >/dev/null 2>/dev/null

# Επανορίζουμε την function "pd_tput", η νέα λειτουργία τής οποίας θα είναι να
# δέχεται μια σειρά από attributes και να τα κατευθύνει τα σχετικά sequenses στο
# τερματικό μέσω τής function "pd_tout" για το standard error, ή της "pd_terr"
# για το standard error.

unset pd_tput

pd_tput() {
	local attr=

	[ $# -lt 1 ] &&
	printf "${pd_ttyattr['reset']}" &&
	return

	for attr in "$@"
	do
		printf "${pd_ttyattr[${attr}]}"
	done
}

# Ορίζουμε την function "pd_tout" που αφορά στο standard output. Αν το standard
# output είναι τερματικό, η "pd_tout" θα αποστέλλει τα terminal attributes στο
# standard output, αλλιώς θα είναι dummy.

if [ -t 1 ]; then pd_tout() { pd_tput "$@"; }
else pd_tout() { :; } fi

# Ακολουθούμε παρόμοια τακτική για το standard error, ορίζοντας την function
# "pd_terr" να αποστέλλει τα terminal attributes στο standard error εφόσον το
# standard error είναι τερματικό, αλλιώς θα είναι dummy.

if [ -t 2 ]; then pd_terr() { pd_tput "$@"; }
else pd_terr() { :; } fi

# Ακολουθούμε παρόμοια τακτική για τα terminal messages γενικά, ορίζοντας την
# function "pd_tmsg" να αποστέλλει τα terminal attributes στο "/dev/tty".

if [ -w "/dev/tty" ]; then pd_tmsg() { pd_tput "$@"; }
else pd_terr() { :; } fi

# Αρχικά η flag "pd_ttymsgon" γίνεται clear. Τίθεται σε "true" ή "false", την
# πρώτη φορά που καλείται η function "pd_ttymsg", ανάλογα με το αν το output
# κατευθύνεται σε τερματικό ή όχι αντίστοιχα.

unset pd_ttymsgon

# Η function "ttymsg" εκτυπώνει μηνύματα προόδου των εργασιών στο control
# terminal κάποιου bash script, εφόσον το script εκτελείται στο foreground.

pd_ttymsg() {
	# Εφόσον δεν έχει τεθεί η flag "pd_ttymsgon", τίθεται σε "true" ή
	# "false" ανάλογα με το αν το output κατευθύνεται σε τερματικό ή όχι
	# αντίστοιχα. Αν αναρωτιέστε για το πώς μπορεί να έχει τεθεί η flag,
	# υπάρχει το ενδεχόμενο να τίθεται μέσω κάποιας option, π.χ. -s, -v,
	# --silent, --verbose κλπ.

	if [ -z "${pd_ttymsgon}" ]; then
		pd_ttymute

		[ -n "${pd_foreground}" ] &&
		[ -w "/dev/tty" ] &&
		pd_ttyvocal
	fi

	[ "${pd_ttymsgon}" = "true" ] &&
	echo -e "$@" >"/dev/tty"

	return 0
}

pd_ttymute() {
	pd_ttymsgon="false"
}

pd_ttyvocal() {
	pd_ttymsgon="true"
}

################################################################################

# Η μεταβλητή "pd_errcode" είναι ένα associative array από error exit codes,
# δεικτοδοτημένο με ονόματα της αρεσκείας μας. Χρησιμοποιώντας αυτό το array
# μπορούμε να κάνουμε exit από τα προγράμματά μας με κωδικοποιημένες ονομασίες
# λαθών μέσω της function "pd_exit", π.χ. pd_exit "memory", pd_exit "perms",
# pd_exit "file" κλπ, αντί του απλού "exit" που για τα παραπάνω παραδείγματα
# θα μπορούσε να είναι: exit 138, exit 201, εxit 214 κλπ.

unset pd_errcode
declare -A pd_errcode

# Ακολουθεί προσωρινή version της function "pd_errmsg", που θα χρησιμοποιήσουμε
# μέχρι να οριστεί η τελική version τής εν λόγω function. Η function δέχεται ένα
# μήνυμα το οποίο εκτυπώνει στο standard error, ενώ αν δοθεί δεύτερη παράμετρος
# τότε αυτή θεωρείται exit code και το πρόγραμμα τερματίζει με το δοθέν exit
# code.

pd_errmsg() {
	[ -n "${pd_progname}" ] &&
	printf "${pd_progname}: " >&2

	[ -n "$1" ] &&
	echo "$1" >&2

	[ -n "$2" ] &&
	exit "$2"

	return 0
}

# Η μεταβλητή "pd_errcodelast" περιέχει το τελευταίο error code που έχει
# χρησιμοποιηθεί από την ίδια την "pandora". Ο προγραμματιστής μπορεί να
# ορίσει νέα error codes τα οποία προτίθεται να χρησιμοποιήσει ως error
# exit codes στα προγράμματά του, καλώντας την function "pd_seterrcode"
# με indices κωδικές ονομασίες της αρεσκείας του, π.χ.
#
#	pd_seterrcode "fatal" "usage" "overflow" "fault" "user undefined"
#
# Με την παραπάνω κλήση, ο προγραμματιστής ορίζει νέα error codes τα οποία
# μπορεί να χρησιμοποιεί ονομαστικά, π.χ.
#
#	pd_exit "fatal"
#	pd_exit "undefined user id"
#	pd_exit "usage"
#
# κλπ.
#
# XXX WARNING (1) XXX
# -------------------
# Η "pandora" έχει κρατημένα τα error codes από το 1 έως το PD_ERRCODEMAX,
# επομένως τα error codes του προγράμματος θα εκκινούν από την τιμή
# (PD_ERRCODEMAX + 1). Επί του παρόντος, το PD_ERRCODEMAX τίθεται στην τιμή
# 100, αλλά αυτό είναι κάτι που μπορεί να αλλάξει στο μέλλον.
#
# XXX WARNING (2) XXX
# -------------------
# Αν ο προγραμματιστής έχει ήδη δώσει το πρόγραμμα στην παραγωγή και επιθυμεί
# να προσθέσει νέες δυνατότητες, ή να προβεί σε οποιαδήποτε τροποποίηση του
# προγράμματος, δεν θα πρέπει να πειράξει τα error codes που υπάρχουν ήδη στο
# πρόγραμμα, ακόμη και αν δεν σκοπεύει να τα χρησιμοποιήσει στη νεότερη έκδοση.
# Αυτό είναι απαραίτητο, καθώς εάν διαγράψει κάποιο από τα παλαιά error codes,
# θα αλλάξουν όλα τα επόμενα error codes, δηλαδή θα έχουμε νέα error codes για
# τις ίδιες κωδικές ονομασίες. Ωστόσο, μπορεί να μετέλθει άλλα μέσα προκειμένου
# να διατηρήσει τα υφιστάμενα error codes, π.χ. να διαγράψει τις εγγραφές που
# δεν χρειάζεται πλέον, αλλά να αυξήσει την "pd_errcodelast" κατά το πλήθος των
# διαδοχικών error codes που διαγράφει. Ακολουθεί παράδειγμα διαγραφής ορισμένων
# error codes, και εισαγωγής νέων:
#
#	# Τρέχουσα version του προγράμματος
#
#	pd_errcode["idx01"]=$((++pd_errcodelast))
#	pd_errcode["idx02"]=$((++pd_errcodelast))
#	pd_errcode["idx03"]=$((++pd_errcodelast))
#	pd_errcode["idx04"]=$((++pd_errcodelast))
#	pd_errcode["idx05"]=$((++pd_errcodelast))
#	pd_errcode["idx06"]=$((++pd_errcodelast))
#	pd_errcode["idx07"]=$((++pd_errcodelast))
#	pd_errcode["idx08"]=$((++pd_errcodelast))
#	pd_errcode["idx09"]=$((++pd_errcodelast))
#	pd_errcode["idx10"]=$((++pd_errcodelast))
#	pd_errcode["idx11"]=$((++pd_errcodelast))
#	pd_errcode["idx12"]=$((++pd_errcodelast))
#	pd_errcode["idx13"]=$((++pd_errcodelast))
#	pd_errcode["idx14"]=$((++pd_errcodelast))
#	pd_errcode["idx15"]=$((++pd_errcodelast))
#	pd_errcode["idx16"]=$((++pd_errcodelast))
#	pd_errcode["idx17"]=$((++pd_errcodelast))
#
# Εννοείται ότι οι πραγματικοί δείκτες "idx01" έως "idx17" έχουν περιγραφικές
# ονομασίες, όπως "usage", "overflow", "out of range", "invalid date" κλπ. Ας
# υποθέσουμε λοιπόν ότι στην καινούρια έκδοση του προγράμματος δεν χρειάζονται
# πια τα error codes "idx05" έως και το "idx08", και τα error codes "idx13" και
# "idx15". Παράλληλα θέλουμε να προσθέσουμε πέντε νέα error codes, εκ των οποίων
# δύο θα έχουν ίδιες κωδικές ονομασίες με δύο από τα παλαιά idices, ενώ τα άλλα
# τρία θα έχουν νέες κωδικές ονομασίες. Αν υποθέσουμε, π.χ. ότι θα τεθούν νέα
# exit codes για τις υπάρχουσες κωδικές ονομασίες "idx06" και "idx08", και θα
# προστεθούν νέες κωδικές ονομασίες ονομασίες "idx18", "idx19" και "idx20", θα
# πρέπει να το κάνουμε κάπως έτσι:
#
#	# Νέα version του προγράμματος
#
#	pd_errcode["idx01"]=$((++pd_errcodelast))
#	pd_errcode["idx02"]=$((++pd_errcodelast))
#	pd_errcode["idx03"]=$((++pd_errcodelast))
#	pd_errcode["idx04"]=$((++pd_errcodelast))
#	$((++pd_errcodelast))	# idx05
#	$((++pd_errcodelast))	# idx06
#	$((++pd_errcodelast))	# idx07
#	$((++pd_errcodelast))	# idx08
#	pd_errcode["idx09"]=$((++pd_errcodelast))
#	pd_errcode["idx10"]=$((++pd_errcodelast))
#	pd_errcode["idx11"]=$((++pd_errcodelast))
#	pd_errcode["idx12"]=$((++pd_errcodelast))
#	$((++pd_errcodelast))	# idx13
#	pd_errcode["idx14"]=$((++pd_errcodelast))
#	$((++pd_errcodelast))	# idx14
#	pd_errcode["idx16"]=$((++pd_errcodelast))
#	pd_errcode["idx17"]=$((++pd_errcodelast))
#
#	pd_errcode["idx06"]=$((++pd_errcodelast))
#	pd_errcode["idx08"]=$((++pd_errcodelast))
#	pd_errcode["idx18"]=$((++pd_errcodelast))
#	pd_errcode["idx19"]=$((++pd_errcodelast))
#	pd_errcode["idx20"]=$((++pd_errcodelast))
#
# Με αυτόν τον τρόπο έχουμε διατηρήσει τα παλαιά error codes και έχουμε προσθέσει
# νέα, είτε με παλαιά indices είτε με καινούρια.

# Η function  "pd_seterrcode" χρησιμοποιείται για να ορίσουμε νέα error codes και
# να τα συσχετίσουμε με ευανάγνωστα strings. Ας υποθέσουμε π.χ. το πρόγραμμά μας
# μπορεί να κάνει ανώμαλο exit για τους εξής λόγους:
#
#	Δόθηκε λανθασμένη option
#	Δεν υπάρχουν permissions
#	Δεν μπορεί να ανοίξει συγκεκριμένο file
#	Λανθασμένα όρια εύρους τιμών
#
# μπορούμε να γράψουμε:
#
#	pd_seterrcode "invopt" "noperm" "fopen" "range"
#
# αλλά είναι καλύτερα και έχουμε ευκολότερα διαχειρίσιμο κώδικα, αν γράψουμε:
#
#	pd_seterrcode "invopt"
#	pd_seterrcode "noperm"
#	pd_seterrcode "fopen"
#	pd_seterrcode "range"
#
# ή ακόμη και:
#
#	pd_seterrcode \
#		"invopt" \
#		"noperm" \
#		"commerr" \
#		"fopen" \
#		"range"
#
# Αν αργότερα αποφασίσουμε να διαγράψουμε τον κωδικό "comerr" και παράλληλα να
# προσθέσουμε δύο νέους κωδικούς "bartan" και "commfail", γράφουμε:
#
#	pd_seterrcode \
#		"invopt" \
#		"noperm" \
#		"" \
#		"fopen" \
#		"range" \
#		"bartan" \
#		"commfail"

# Κρατάμε «καβάντζα» τα error codes μέχρι και το 100, προκειμένου να υπάρχει
# πληθώρα επιλογών για την ίδια την "pandora". Αυτό σημαίνει ότι τα error codes
# που μπορεί να χρησιμοποιήσει ο προγραμματιστής θα είναι από 101 έως 255.

PD_ERRCODEMAX=100

pd_seterrcode() {
	local idx=
	local err=

	for idx in "$@"
	do
		[ -z "${idx}" ] &&
		let $((pd_errcodelast++)) &&
		continue

		[ -z "${pd_errcode["${idx}"]}" ] &&
		pd_errcode["${idx}"]=$((++pd_errcodelast)) &&
		continue

		pd_errmsg "${idx}: redefined index"
		err="yes"
	done

	[ -z "${err}" ] &&
	return 0

	type -t pd_exit >"/dev/null" 2>&1 &&
	pd_exit "pd_errcode"

	exit ${PD_ERRCODEMAX}
}

# Ο μετρητής "pd_errcodelast" δείχνει το τελευταίο error code που έχει αποδοθεί.
# Ο μετρητής αυτός ενημερώνεται από το πρόγραμμα και σε καμία περίπτωση δεν πρέπει
# να πειραχτεί «με το χέρι».

pd_errcodelast=0

# Θέτουμε άμεσα τα error codes της ίδιας της "pandora".

pd_seterrcode \
	"pd_usage" \
	"pd_internal" \
	"pd_errnil" \
	"pd_errcode" \
	"pd_traperr" \
	"pd_signal" \
	"pd_sleep" \
	"pd_tmperr"

[ ${pd_errcodelast} -ge ${PD_ERRCODEMAX} ] &&
pd_exit "error code overflow (${pd_errcodelast})" ${PD_ERRCODEMAX}

pd_errcodelast=${PD_ERRCODEMAX}

# Η function "pd_errdecode" επιστρέφει το exit status το οποίο έχει συσχετιστεί
# με την κωδική ονομασία που περνάμε ως μια και μοναδική παράμετρο στην εν λόγω
# function.

pd_errdecode() {
	local err=

	[ -z "$1" ] &&
	unset pd_errlevel &&
	pd_errmsg "missing exit code" &&
	echo ${PD_ERRCODEMAX} &&
	return 0

	# Αν περάσουμε αριθμητική παράμετρο, τότε επιστρέφεται αυτούσια καθώς
	# δεν χρειάζεται να αποκωδικοποιήσουμε ένα ήδη έτοιμο exit status code.

	[[ "$1" =~ ^[0-9]+$ ]] &&
	echo $1 &&
	return 0

	err="${pd_errcode["$1"]}"

	[ -n "${err}" ] &&
	echo ${err} &&
	return 0

	# Σε περίπτωση που η κωδική ονομασία που περνάμε ως παράμετρο δεν έχει
	# αντιστοιχηθεί σε κάποια αριθμητική τιμή, επιστρέφουμε την μέγιστη
	# εσωτερική τιμή, χωρίς να διακόψουμε τη λειτουργία του προγράμματος,
	# αλλά εκτυπώνουμε μήνυμα λάθους προκειμένου ο προγραμματιστής να
	# αντιστοιχίσει τη συγκεκριμένη κωδική ονομασία με κάποια αριθμητική
	# τιμή, ή να διορθώσει ενδεχόμενο τυπογραφικό σφάλμα στην ονομασία.

	pd_errmsg "$1: undefined exit code" >&2
	echo ${PD_ERRCODEMAX}
	return 0
}

################################################################################

# Η μεταβλητή "pd_usagemsg" τίθεται στο μήνυμα που επιθυμούμε να εμφανίσουμε
# κατά την κλήση της function "pd_usage" η οποία καλείται όποτε κρίνουμε ότι
# πρέπει να εμφανίσουμε στο standard error τον ορθό τρόπο κλήσης και χρήσης
# των options και των λοιπών παραμέτρων του προγράμματος.

pd_usage() {
	local progname=

	progname="${pd_usageprg}"

	[ -z "${progname}" ] &&
	progname="${pd_progname}"

	printf "usage: " >&2
	printf "${progname}" >&2

	[ -z "${pd_usagemsg}" ] &&
	pd_usagemsg="[OPTIONS] [ARGUMENTS]"

	printf " ${pd_usagemsg}" >&2

	[ $# -gt 0 ] &&
	printf "$@" >&2

	echo "" >&2
	pd_exit "pd_usage"
}

# Η function "pd_parseopts" χρησιμοποιείται για την αποκωδικοποίηση των options
# που έχουν δοθεί στο command line. Εφόσον οι options είναι δεκτές απαλείφονται
# επιστρέφονται τα υπόλοιπα arguments του command line. Ως πρώτη παράμετρο
# δίνουμε το short option string, ενώ το long option string δίνεται ως δεύτερη
# παράμετρος. Κατόπιν ακολουθούν τα arguments που δόθηκαν στο command line.
#
# Η function έχει ως output έναν μη μηδενικό αριθμό, εφόσον εντοπίστηκαν
# σφάλματα στις options, αλλιώς στο output εκτυπώνεται ο αριθμός μηδέν,
# ακολουθούμενος από τα υπόλοιπα arguments του command line. Επομένως, αν
# το πρώτο argument είναι ένας μη μηδενικός αριθμός, θα πρέπει να διακόψουμε
# τη λειτουργία του προγράμματος, ενώ σε περίπτωση που το πρώτο argument είναι
# μηδέν, το απαλείφουμε (shift) και προχωρούμε αρχικά στο κλασσικό loop ελέγχου
# των options, και αμέσως μετά προχωρούμε στη διαχείριση των υπόλοιπων command
# line arguments. Ακολουθεί παράδειγμα που δείχνει τη συνήθη χρήση τής function
# "pd_parseopts":
#
#	eval set -- "$(pd_parseopts "hibF:D" "help,inetractive,batch,conf:,\
#	debug,user:,host:,database:,nlslang:,linesize:,colsep:,null:" "$@")"
#	[ $1 -ne 0 ] && pd_usage
#	shift

pd_parseopts() {
	local short=
	local long=
	local args=

	short="$1"
	long="$2"
	shift 2

	args="$(getopt -n "${pd_progname}" -o "${short}" -l "${long}" -- "$@")" &&
	echo 0 "${args}" &&
	return 0

	echo 1 &&
	return 1
}

################################################################################

# Η "pd_sigtrap" καλείται στις περιπτώσεις εκείνες κατά τις οποίες προτιθέμεθα
# να χρησιμοποιήσουμε προσωρινά αρχεία, και πριν αυτά δημιουργηθούν. Σκοπός τής
# "pd_sigtrap" είναι να κληθεί η function "pd_exit" στις περιπτώσεις κατά τις
# οποίες η λειτουργία τού προγράμματος διακόπτεται βίαια από interrupt signals.
# Η function "pd_exit" τερματίζει τη λειτουργία του προγράμματος, ωστόσο πριν
# τον τερματισμό του προγράμματος, καλεί την function "pd_before_exit" η οποία
# μπορεί να επιστρέφει μηδέν εφόσον επιθυμούμε πράγματι τη διακοπή λειτουργίας
# του προγράμματος, αλλιώς ακυρώνεται η διαδικασία τερματισμού λειτουργίας τού
# προγράμματος.
#
# By default η function ελέγχει τα κλασσικά signals διακοπής, δηλαδή τα signals
# "SIGHUP", "SIGINT", "SIGQUIT" και "SIGTERM", ενώ με την option "-a" ελέγχουμε
# όλα τα signals που μπορούν να ελεγχθούν.
#
# Αν δεν μας ικανοποιεί η "pd_sigtrap", μπορούμε πάντα να στήσουμε τις δικές μας
# «παγίδες» ελέγχου των signals διακοπής, αλλά όπως ήδη αναφέραμε, ίσως να είναι
# ευκολότερο να κατασκευάσουμε τη δική μας "pd_before_exit" function.

pd_sigtrap() {
	local slist=
	local sigmax=
	local sig=
	local gis=
	local signame=
	local err=
	local msg=

	if [ $# -lt 1 ]; then
		slist="SIGHUP SIGINT SIGQUIT SIGTERM"
	elif [ "$1" = "-a" ]; then
		sigmax="$(kill -l SIGRTMAX 2>"/dev/null")"

		[ -z "${sigmax}" ] &&
		sigmax=64

		for ((sig = ${sigmax}; sig > 0; sig--))
		do
			slist="${slist} ${sig}"
		done
	else
		slist="$@"
	fi

	for sig in ${slist}
	do
		if [[ "${sig}" =~ ^[0-9]+$ ]]; then
			gis="${sig}"
		elif [[ "${sig}" =~ ^SIG ]]; then
			gis="$(kill -l "${sig}" 2>"/dev/null")"
		else
			gis="$(kill -l "SIG${sig}" 2>"/dev/null")"
		fi

		signame="$(kill -l "${gis}" 2>"/dev/null")"

		[ $? -ne 0 ] &&
		pd_errmsg "${sig}: invalid signal specification" &&
		err="yes"

		[ -n "${err}" ] &&
		continue

		if [ -z "${signame}" ]; then
			signame="signal ${gis}"
		elif [[ ! "${signame}" =~ ^SIG ]]; then
			signame="SIG${signame}"
		fi

		msg="program intterrupted (${signame})"
		trap "pd_exit '${msg}' 'pd_signal'" ${gis}
	done

	[ -z "${err}" ] &&
	return 0

	pd_exit "pd_traperr"
}

################################################################################

pd_tmpcleanup() {
	local i=

	# Το loop που ακολουθεί, τρέχει μόνον εφόσον υπάρχει το array
	# ονομάτων προσωρινών αρχείων. Επομένως αν δεν προτιθέμεθα να
	# χρησιμοποιήσουμε προσωρινά αρχεία στο πρόγραμμά μας, καλό
	# είναι να διαγράψουμε το array ονομάτων προσωρινών αρχείων
	# αμέσως μετά το διάβασμα της "pandora" libray στην αρχή τού
	# προγράμματός μας. Μπορούμε, επίσης, να διαγράψουμε το array
	# προσωρινών ονομάτων και να δημιουργήσουμε δικό μας array με
	# λιγότερα ή άλλου είδους ονόματα.

	for i in "${pd_tmpname[@]}"
	do
		[ -f "${i}" ] &&
		rm -rf "${i}"
	done

	return 0
}

################################################################################

# Ήρθε η ώρα να ορίσουμε την «κανονική» error function της "pandora".
# Πρώτο βήμα είναι να ακυρώσουμε την πρόχειρη version που είχαμε ορίσει
# αρχικά.

unset pd_errmsg

# Θέτουμε το default error level. Το error level είναι ένας θετικός ακέραιος
# αριθμός που δείχνει το «βάθος» της ανάλυσης των μηνυμάτων λάθους όσον αφορά
# το ακριβές σημείο του script στο οποίο συνέβη το σφάλμα.

pd_errlevel=0

pd_errmsg() {
	local depth=
	local count=
	local i=
	local s=

	[ -n "${pd_progname}" ] &&
	printf "${pd_progname}" >&2

	if [ -n "${pd_errlevel}" ]; then
		depth="$((${#FUNCNAME[@]}-2))"
		count="${depth}"

		[ -n "${pd_errlevel}" ] &&
		[ "${count}" -gt "${pd_errlevel}" ] &&
		count="${pd_errlevel}"

		printf "[" >&2
		printf "${BASH_LINENO[$((depth))]}" >&2
		printf "]" >&2

		for ((i = $((depth)); i > 0; i--))
		do
			[[ $((count--)) -le 0 ]] &&
			break

			printf "${FUNCNAME[$((i))]}"
			printf "[${BASH_LINENO[$((i-1))]}"
			printf "]"
			s="${s})"
		done >&2

		printf "${s}" >&2
	fi

	printf ": " >&2

	[ $# -lt 1 ] &&
	return 0

	echo -e "${@}" >&2
	return 0
}

unset pd_before_exit

pd_exit() {
	local err=
	local rre=

	declare -F "pd_before_exit" >/dev/null &&
	! pd_before_exit &&
	return

	# Αν εντοπίσουμε sleep child process σε εξέλιξη, το «καθαρίζουμε»
	# προκειμένου να ξεμπλοκάρουμε το parent (main) bash process.

	[ -n "${pd_sleepid}" ] &&
	kill ${pd_sleepid} 2>"/dev/null"
	unset pd_sleepid

	# Διαγράφουμε προσωρινά αρχεία που ενδεχομένως έχει δημιουργήσει το
	# πρόγραμμα.

	pd_tmpcleanup

	# Επαναφέρουμε τα settings του τερματικού στα default settings,
	# καθώς υπάρχει περίπτωση να έχουμε διακοπή του προγράμματος με
	# τα settings του τερματικού αλλοιωμένα.

	pd_tout >&1
	pd_terr >&2

	if [ $# -gt 2 ]; then
		pd_errmsg "pd_exit: invalid arguments' count"
		err="pd_usage"
	elif [ $# -eq 2 ]; then
		pd_errmsg "$1"
		err="$2"
	elif [ $# -eq 1 ]; then
		err="$1"
	else
		exit 0
	fi

	rre="$(pd_errdecode "${err}")"

	[ "${rre}" != "${err}" ]  &&
	[ -n "${pd_errlevel}" ] &&
	pd_errmsg &&
	printf "error exit code: " >&2 &&
	printf "${err} " >&2 &&
	printf "(" >&2 &&
	printf "${rre}" >&2 &&
	echo ")" >&2

	exit ${rre}
}

################################################################################

[ -z "${pd_tmpdir}" ] &&
pd_tmpdir="/tmp"

[[ "${pd_tmpdir}" =~ ^/ ]] ||
pd_exit "${pd_tmpdir}: not a full pathname" "pd_tmperr"

[ -d "${pd_tmpdir}" ] ||
pd_exit "${pd_tmpdir}: no such directory" "pd_tmperr"

[ -r "${pd_tmpdir}" ] &&
[ -w "${pd_tmpdir}" ] &&
[ -x "${pd_tmpdir}" ]

[ $? -ne 0 ] &&
pd_exit "${pd_tmpdir}: no permission" "pd_tmperr"

if [ -z "${pd_tmpmax}" ]; then
	pd_tmpmax=0
elif [[ ! "${pd_tmpmax}" =~ ^[0-9]$ ]]; then
	pd_exit "${pd_tmpmax}: invalid max tmp index" "pd_tmperr"
fi

unset pd_tmpname
declare -a pd_tmpname

pd_tmpcreate() {
	local i=

	for ((i = 1; i <= ${pd_tmpmax}; i++))
	do
		pd_tmpname[${i}]="${pd_tmpdir}/$$pd${i}"
	done
}

# Δημιουργούμε τα ονόματα των προσωρινών αρχείων που μπορούμε να
# χρησιμοποιήσουμε και μετά διαγράφουμε την function δημιουργίας
# των ονομάτων αυτών.

pd_tmpcreate
unset pd_tmpcreate

################################################################################

# Η function "pd_partmatch" δέχεται ως παραμέτρους ένα string και ένα pattern
# και ελέγχει αν το string αυτό «ταιριάζει» με το pattern. Το «ταίριαγμα» είναι
# κάπως ιδιαίτερο και ο πλέον εύκολος τρόπος να δείξουμε τη χρήση της function
# είναι μέσα από παραδείγματα.
#
# Ας υποθέσουμε ότι κάποιο από τα προγράμματά μας δέχεται την option "database"
# με παράμετρο τη λέξη "INSERT" ή τη λέξη "REPLACE", π.χ.
#
#	myprog --database=INSERT
#
# Ας υποθέσουμε, επίσης, ότι επιθυμούμε να διευκολύνουμε τον χρήστη δίνοντας τη
# δυνατότητα να καθορίσει μέρος της λέξης "INSERT", π.χ. "INS", "IN", ή ακόμη
# και "I", π.χ.
#
#	myprog --database=I
#
# Σ' αυτήν την περίπτωση θα μας φανεί χρήσιμη η function "pd_partmatch" ως εξής:
#
#	pd_partmatch "${arg}" "INSERT"
#
# όπου "${arg}" είναι το όρισμα της option "--database". Η function επιστρέφει
# μηδέν εφόσον η τιμή του "${arg}" είναι δεκτή, αλλιώς επιστρέφει μη μηδενική
# τιμή.
#
# Η function δέχεται και δύο options, τις "-i" και "-v", όπου η option "-i"
# σημαίνει case irrelevant και επιτρέπει τιμές είτε με πεζά, είτε με κεφαλαία
# γράμματα, ασχέτως του αν το pattern έχει δοθεί με κεφαλαία ή πεζά στοιχεία.
# Η option "-v" σημαίνει vocal, δηλαδή η function τυπώνει στο standard output
# το pattern που έχει δοθεί, εφόσον υπάρχει match. Εναλλακτικά παρέχεται και
# η option "-q" που σημαίνει quiet και είναι το αντίθετο του vocal, συνεπώς
# θα τη χρησιμοποιήσετε σπάνια, καθώς by default η "pd_partmatch" δεν εκτυπώνει
# το pattern.
#
#	usage: pd_partmatch [-i] [-v] [-q] value pattern...

pd_partmatch() {
	local arg=
	local vocal=
	local case="yes"
	local val=
	local len=
	local pat=
	local tap=
	local diana=
	local count=

	eval set -- "$(pd_parseopts "iqv" "" "$@")"
	[ $1 -ne 0 ] &&
	pd_errmsg "pd_partmatch: invalid option" &&
	return 1

	shift

	for arg in "$@"
	do
		case "${arg}" in
		-q)	vocal=;		shift;;
		-v)	vocal="yes";	shift;;
		-i)	case=;		shift;;
		--)	shift;		break;;
		esac
	done

	[ $# -lt 2 ] &&
	pd_errmsg "usage: ${FUNCNAME[0]} [-i] [-q] [-v] val patterns..." &&
	return 1

	if [ -n "${case}" ]; then
		val="$1"
	else
		val="${1^^}"
	fi

	len="${#val}"

	[ "${len}" -lt 1 ] &&
	return 1

	shift

	diana=
	count=0

	for pat in "$@"
	do
		[ "${len}" -gt "${#pat}" ] &&
		continue

		if [ -n "${case}" ]; then
			tap="${pat}"
		else
			tap="${pat^^}"
		fi

		[ "${val}" != "${tap:0:${len}}" ] &&
		continue

		[ ${count} -gt 0 ] &&
		return 2

		diana="${pat}"
		count=1
	done

	[ ${count} -ne 1 ] &&
	return 1

	[ -n "${vocal}" ] &&
	echo "${diana}"

	return 0
}

#	usage: pd_isinteger value [ min [ max ] ]

pd_isinteger() {
	local min=
	local max=
	local err=

	# Αν η πρώτη παράμετρος δεν έχει την εικόνα ενός ακεραίου, με ή χωρίς
	# πρόσημο, τότε επιστρέφει μη μηδενική τιμή (αποτυχία).

	[[ "$1" =~ ^[-+]?[0-9]+$ ]] ||
	return 1

	# Αν δεν έχει δοθεί άλλη παράμετρος, τότε επιστρέφεται μηδέν, καθώς δεν
	# επιθυμούμε περαιτέρω έλεγχο του αριθμού όσον αφορά το min και το max.

	[ $# -lt 2 ] &&
	return 0

	# Αν έχουν δοθεί περισσότερες από δτρεις παραμέτρους, τότε η function
	# εχει κληθεί με λάθος τρόπο, επομένως το πρόγραμμα θα πρέπει να
	# διορθωθεί και ως εκ τούτου τερματίζουμε τη λειτουργία του με μη
	# μηδενικό exit status.

	[ $# -gt 3 ] &&
	pd_exit "extra arguments" "pd_internal"

	# Εφόσον έχουν δοθεί επιπλέον παράμετροι, τότε αυτές είναι το κάτω και
	# το πάνω όριο αντίστοιχα, του προς έλεγχο αριθμού. Οι τιμές των ορίων
	# θεωρούνται δεκτές, επομένως ο αριθμός ελέγχεται να ανήκει στο διάστημα
	# [ min, max ]. Αν μια από τις δύο παραμέτρους είναι κενή ή δεν έχει
	# καθοριστεί, τότε ο αριθμός ελέγχεται μόνο ως προς το όριο που έχει
	# καθοριστεί.

	min="$2"
	max="$3"

	# Εφόσον το min ή το max έχουν καθοριστεί, ελέγχονται και αυτά ως προς
	# το κατά πόσον είναι ακέραιοι αριθμοί ή όχι. Εάν παρατηρηθεί σχετική
	# ανωμαλία, τότε αυτό θεωρείται προγραμματιστικό λάθος που θα πρέπει να
	# διορθωθεί, επομένως η λειτουργία του προγράμματος τερματίζεται με μη
	# μηδενικό exit status.

	[ -n "${min}" ] &&
	! pd_isinteger "${min}" &&
	pd_errmsg "${min}: invalid low limit" &&
	err="yes"

	[ -n "${max}" ] &&
	! pd_isinteger "${max}" &&
	pd_errmsg "${max}: invalid upper limit" &&
	err="yes"

	[ -n "${err}" ] &&
	pd_exit "pd_internal"

	# Εφόσον έχει δοθεί κάτω όριο (min), ελέγχεται ο αριθμός να μην είναι
	# μικρότερος από το εν λόγω όριο. Αν ο έλεγχος αποτύχει, τότε η function
	# επιστρέφει την τιμή 2 (αποτυχία).

	[ -n "${min}" ] &&
	[ $1 -lt ${min} ] &&
	return 2

	# Εφόσον έχει δοθεί πάνω όριο (max), ελέγχεται ο αριθμός να μην είναι
	# μεγαλύτερος από το εν λόγω όριο. Αν ο έλεγχος αποτύχει, τότε η
	# function επιστρέφει την τιμή 3 (αποτυχία).

	[ -n "${max}" ] &&
	[ $1 -gt ${max} ] &&
	return 3

	# Η διαδικασία ελέγχου απεδείχθη επιτυχής σε όλα τα σκέλη και ως εκ
	# τούτου, η function επιστρέφει μηδενική τιμή (επιτυχία).

	return 0
}

# Η function "pd_push" δέχεται ένα string το οποίο απλώς το εκτυπώνει. Αν όμως
# περάσουμε και δεύτερο string τότε εκτυπώνει το πρώτο string συνοδευόμενο από
# το δεύτερο string χωρισμένα μεταξύ τυς με ένα κενό. Αν θέλουμε μπορουμε να
# περάσουμε και τρίτο string το οποίο θα χρησιμοποιηθεί ως ενωτικό μεταξύ των
# δύο strings (αντί του κενού).

pd_push() {
	local s
	local t
	local c

	case $# in
	1)
		echo "$1"
		return 0
		;;
	2)
		s="$1"
		t="$2"
		c=" "
		;;
	3)
		s="$1"
		t="$2"
		c="$3"
		;;
	esac

	[ -n "${s}" ] &&
	s="${s}${c}"

	echo "${s}${t}"
	return 0
}

# Η function "pd_sleep" υποκαθιστά την εντολή sleep, για λόγους που σχετίζονται
# με τη συμπεριφορά του προγράμματος sleep απέναντι σε απόπειρες διακοπής μέσω
# interrupt signals. Πράγματι, ενόσω το πρόγραμμά μας εκτελεί την εντολή sleep,
# δεν αντιδρά άμεσα στα interrupt signals, αλλά μόνο μετά τη λήξη της εντολής
# sleep. Αυτή η συμπεριφορά δημιουργεί διάφορα προβλήματα τα οποία καλείται να
# λύσει η function "pd_sleep".

unset pd_sleepid

pd_sleep() {
	local prm="$1"

	# Αν δεν καθοριστεί χρόνος αδράνειας, τότε υποτίθεται το διηνεκές.

	[ -z "${prm}" ] &&
	prm="infinity"

	# Εκτελούμε την εντολή sleep, αλλά στο background. Παράλληλα, κρατάμε
	# το process id της συγκεκριμένης εντολής στη μεταβλητή "pd_sleepid".

	sleep "${prm}" &
	pd_sleepid=$!

	# Θέτουμε το πρόγραμμα σε διαδικασία αναμονής τέλους της εντολής sleep
	# που εκκινήσαμε μόλις πριν στο background. Η διαφορά έγκειται στο ότι
	# η εντολή wait αντιδρά άμεσα στα interrupt signals.

	wait ${pd_sleepid} 2>"/dev/null"
	unset pd_sleepid
}

# Η function "pd_running" δέχεται ως παράμετρο ένα process-id και επιστρέφει
# μηδέν αν υπάρχει ενεργό process με το δοθέν process-id, αλλιώς επιστρέφει μη
# μηδενική τιμή.

pd_running() {
	[ $# -ne 1 ] &&
	pd_errmsg "usage: ${FUNCNAME[0]} pid" &&
	pd_exit "pd_usage"

	[ -z "$1" ] &&
	return 1

	[ -e "/proc/$1" ]
}

pd_name2ip() {
	getent hosts "$1" | awk -v ret=1 'NF > 1 {
	print $1
	ret = 0
	exit(ret)
}
END {
	exit(ret)
}'
}

pd_pipefail() {
	local plist="${PIPESTATUS[@]}"
	local n=
	local i=

	set -- ${plist[@]}

	[ $# -lt 1 ] &&
	return 0

	n=$#

	for ((i=1; i <= n; i++))
	do
		[ "$1" != "0" ] &&
		echo "${i}" &&
		return 1

		shift
	done

	return 0
}

# Η function "pd_yesno" δέχεται ως πρώτη και μοναδική παράμετρο ένα string και
# ελέγχει αν πρόκειται για "yes", "no", "true", "false", "1", "0" και τυπώνει
# "1" για τα strings "yes", "true" και "1", ενώ τυπώνει "0" για τα υπόλοιπα.
# Αν η δοθείσα παράμετρος δεν ταιαριάζει με ένα από τα παραπάνω strings, τότε
# η function δεν τυπώνει τίποτα και επιστρέφει μη μηδενικό exit status.

pd_yesno() {
	local nai=
	local oxi=

	case $# in
	1)
		nai=1
		oxi=0
		;;
	2)
		nai="$2"
		oxi=
		;;
	3)
		nai="$2"
		oxi="$3"
		;;
	*)
		return 1
		;;
	esac

	pd_partmatch -i "$1" "YES" "TRUE" "1" &&
	echo "${nai}" &&
	return 0

	pd_partmatch -i "$1" "NO" "FALSE" "0" &&
	echo "${oxi}" &&
	return 0

	return 1
}

pd_isdate() {
	date --date "$1" >"/dev/null" 2>"/dev/null" ||
	return 1

	echo "$1"
	return 0
}

pd_isemail() {
	local r1="[A-Za-z0-9!#\$%&'*+/=?^_\`{|}~-]+"
	local r2="[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?"
	local re="^${r1}(\.${r1})*@(${r2}\.)+${r2}\$"

	[[ "$@" =~ ${re} ]]
}
