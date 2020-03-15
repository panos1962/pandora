#!/usr/bin/env make -f

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Updated: 2019-12-25
#
###############################################################################@

BUNDLE = bundle.js
BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

.PHONY: all
all:
	make $(BUNDLE)

$(BUNDLE): main.js ../../lib/pandoraClient.js ../../lib/pandoraCore.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js

.PHONY: cleanup
cleanup:
	@rm -f $(BUNDLE)
