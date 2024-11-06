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

.PHONY: show
show:
	@git add --dry-run .

.PHONY: status
status:
	@git status .

.PHONY: add
add:
	@git add --verbose .

.PHONY: commit
commit:
	@git commit --message "modifications" .; :

.PHONY: push
push:
	@git push

.PHONY: diff
diff:
	@git diff .

.PHONY: pull
pull:
	@git pull

.PHONY: cleanup
cleanup:
	@misc/cleanup.sh
	@(cd www && make cleanup)
