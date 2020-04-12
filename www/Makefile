#!/usr/bin/env make -f

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Updated: 2019-12-25
#
###############################################################################@

BUNDLE_JS = bundle.js

PANDORA_CSS = lib/pandora.css
PANDORA_PRINT_CSS = lib/pandoraPrint.css
PANDORA_DEBUG_CSS = lib/pandoraDebug.css

MAIN_CSS = main.css
MAIN_DEBUG_CSS = mainDebug.css

PARAGOGA = \
$(BUNDLE_JS) \
$(PANDORA_CSS) \
$(PANDORA_PRINT_CSS) \
$(PANDORA_DEBUG_CSS) \
$(MAIN_CSS) \
$(MAIN_DEBUG_CSS)

BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

STYLUS_OPTS = --print --compress
STYLUS_OPTS = --print

.PHONY: all
all: $(PARAGOGA)
	@(cd test && make)
	@(cd isodos && make)

$(BUNDLE_JS): \
	lib/pandoraCore.js \
	lib/pandora.js \
	lib/pandoraPaleta.js \
	main.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js

$(PANDORA_CSS): lib/pandora.styl
	@stylus $(STYLUS_OPTS) --prefix 'pnd-' lib/pandora.styl >$@

$(PANDORA_PRINT_CSS): lib/pandoraPrint.styl
	@stylus $(STYLUS_OPTS) --prefix 'pnd-' lib/pandoraPrint.styl >$@

$(PANDORA_DEBUG_CSS): lib/pandoraDebug.styl
	@stylus $(STYLUS_OPTS) --prefix 'pnd-' lib/pandoraDebug.styl >$@

$(MAIN_CSS): main.styl
	@stylus $(STYLUS_OPTS) main.styl >$@

$(MAIN_DEBUG_CSS): mainDebug.styl
	@stylus $(STYLUS_OPTS) mainDebug.styl >$@

.PHONY: cleanup
cleanup:
	@rm -f $(PARAGOGA)
