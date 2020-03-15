#!/usr/bin/env make -f

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Updated: 2019-12-25
#
###############################################################################@

BUNDLEJS = bundle.js
BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

CSS = lib/pandora.css lib/pandoraDebug.css main.css

STYLUS_OPTS = --print --compress
STYLUS_OPTS = --print

.PHONY: all
all: $(BUNDLEJS) $(CSS)
	@(cd test && make)
	@(cd isodos && make)

$(BUNDLEJS): \
	lib/pandoraCore.js \
	lib/pandora.js \
	lib/pandoraPaleta.js \
	main.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js

lib/pandora.css: lib/pandora.styl
	@stylus $(STYLUS_OPTS) --prefix 'pnd-' lib/pandora.styl >$@

lib/pandoraDebug.css: lib/pandoraDebug.styl
	@stylus $(STYLUS_OPTS) --prefix 'pnd-' lib/pandoraDebug.styl >$@

main.css: main.styl
	@stylus $(STYLUS_OPTS) main.styl >$@

.PHONY: cleanup
cleanup:
	@rm -f $(BUNDLE)
