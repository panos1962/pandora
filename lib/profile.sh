[ -z "${PANDORA_BASEDIR}" ] &&
export PANDORA_BASEDIR="/var/opt/pandora"

[ -d "${PANDORA_BASEDIR}" ] &&
[ -r "${PANDORA_BASEDIR}" ] &&
[ -x "${PANDORA_BASEDIR}" ] &&
PATH="${PATH}:${PANDORA_BASEDIR}/bin" &&
export AWKPATH="${AWKPATH}:${PANDORA_BASEDIR}/lib"

[ $? -ne 0 ] &&
unset PANDORA_BASEDIR
