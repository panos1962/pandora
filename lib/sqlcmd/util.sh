#!/usr/bin/env bash

trimset() {
	[ "$1" = "0" ] &&
	trim= &&
	return 0

	[ "$1" = "1" ] &&
	trim="yes" &&
	return 0

	pd_partmatch -i "$1" "YES" &&
	trim="yes" &&
	return 0

	pd_partmatch -i "$1" "NO" &&
	trim= &&
	return 0

	pd_errmsg "$1: invalid trim option value"
	return 1
}

headerset() {
	[ "@$1" = "@-1" ] &&
	header="-1" &&
	return 0

	pd_isinteger "$1" 1 32767 &&
	header="$1" &&
	return 0

	pd_errmsg "$1: invalid header option value"
	return 1
}

colsepset() {
	pd_partmatch -i "$1" "TAB" &&
	colsep="	" &&
	return 0

	colsep="${1:0:1}"

	[ "${colsep}" = "$1" ] &&
	return 0

	[ -n "${verbose}" ] &&
	pd_errmsg "WARNING: colsep set to \"${colsep}\"(${1:1})" >&2
	return 0
}
