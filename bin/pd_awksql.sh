#!/usr/bin/env bash

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Created: 2010-01-02
#
###############################################################################@

. "${PANDORA_BASEDIR:=/var/opt/pandora}/lib/pandora.sh" ||
exit 2

pd_usagemsg="[ OPTIONS…] [ FILES… ]"

pd_seterrcode \
	""

eval set -- "$(pd_parseopts "D" \
"debug" "$@")"

[ $1 -ne 0 ] &&
pd_usage

shift

error=

for arg in "$@"
do
	case "${arg}" in
	-D|--debug)
		debug="yes"
		shift 1
		;;
	--)
		shift
		break
		;;
	esac
done
unset arg

[ -n "${error}" ] &&
pd_usage

exec awk \
-i "${PANDORA_BASEDIR}/lib/pandora.awk" \
-i "${PANDORA_BASEDIR}/lib/awksql.awk" \
"$@"
