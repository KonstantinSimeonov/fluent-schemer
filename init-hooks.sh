#!/bin/bash

HOOKS="pre-commit"
HOOKS_DIR=".git/hooks"

for HOOK in $HOOKS; do
	rm "${HOOKS_DIR}/${HOOK}"
	cp "./git-hooks/${HOOK}.sh" "${HOOKS_DIR}/${HOOK}"
done