#!/usr/bin/env make -f

###############################################################################@
#
# Copyright (C) 2019 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
#
# Updated: 2019-12-25
#
###############################################################################@

all:
	@(cd www && make)

.PHONY: test
test:
	@make -s all
	@local/test.sh

.PHONY: git
git:
	@make -s status
	@make -s commit
	@make -s push
	@echo '################################################################'
	@make -s status
	@make -s commit
	@make -s push

.PHONY: status
status:
	@hg status

.PHONY: commit
commit:
	@hg commit -A -m "modifications" || :

.PHONY: push
push:
	@hg push || :

.PHONY: diff
diff:
	@hg diff

.PHONY: pull
pull:
	@hg pull -u

.PHONY: cleanup
cleanup:
	@misc/cleanup.sh
