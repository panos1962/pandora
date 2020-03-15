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
