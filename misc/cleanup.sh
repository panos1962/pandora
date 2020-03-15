#!/usr/bin/env bash

###############################################################################@
#
# @BEGIN
#
# @COPYRIGHT BEGIN
# Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
# @COPYRIGHT END
#
# @FILETYPE BEGIN
# bash
# @FILETYPE END
#
# @FILE BEGIN
# misc/cleanup.sh —— Διαγραφή παράγωγων και περιττών αρχείων
# @FILE END
#
# @DESCRIPTION BEGIN
# Με το παρόν επιχειρείται καθαρισμός του τοπικού αποθετηρίου από παράγωγα και
# περιττά αρχεία. Παράγωγα αρχεία λογίζονται αυτά που κατασκευάζονται από άλλα
# αρχεία, ενώ περιττά είναι τα προσωρινά αρχεία και άλλα πρόχειρα αρχεία που
# ενδεχομένως να έχουν παραμείνει στο αποθετήριο.
# @DESCRIPTION END
#
# @HISTORY BEGIN
# Created: 2020-01-12
# @HISTORY END
#
# @END
#
###############################################################################@

. "${PANDORA_BASEDIR:=/var/opt/pandora}/lib/pandora.sh"

pd_usagemsg=

[ $# -ne 0 ] &&
pd_usage

bundlejs_cleanup() {
	find . -type f -name 'bundle.js' -exec rm -f {} \;
}

bundlejs_cleanup
