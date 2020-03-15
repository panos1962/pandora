#!/usr/bin/env bash

name="Vivaldi"
wid=$(xdotool search --onlyvisible --name "${name}" | head -1)

if [ -n "${wid}" ]; then
	xdotool windowactivate "${wid}"
	xdotool key 'ctrl+r'
	exit 0
fi

vivaldi 'http://localhost/pandora/index.php?debug' &
wid=$(xdotool search --onlyvisible --name "${name}" | head -1)

[ -n "${wid}" ] &&
xdotool windowfocus "${wid}"

exit 0
