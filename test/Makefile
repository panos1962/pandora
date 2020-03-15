#!/usr/bin/env make -f

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Updated: 2019-12-25
#
###############################################################################@

BROWSERIFY_OPTS = -t envify -p tinyify
BUNDLEJS = bundle.js

.PHONY: all
all:
	@make test

.PHONY: test
test: $(BUNDLEJS)
	@bash test.sh

$(BUNDLEJS): testClient.js ../lib/pandoraClient.js ../lib/pandoraCore.js
	browserify $(BROWSERIFY_OPTS) -o $@ testClient.js

.PHONY: cleanup
cleanup:
	@rm -f $(BUNDLEJS)
