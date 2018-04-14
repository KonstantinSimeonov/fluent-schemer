#!/bin/bash

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep "\.ts$")

echo $STAGED_FILES;
if [[ "$STAGED_FILES" == "" ]]; then
	exit 0
fi

PASSING=true

echo "\nRunning TSlint:\n";

for FILE_NAME in $STAGED_FILES
do
	yarn tslint "$FILE_NAME"

	if [[ "$?" == 0 ]]; then
		echo "tslint PASSED: $FILE_NAME"
	else
		echo "tslint FAILED: $FILE_NAME"
		PASSING=false
	fi
done

if ! $PASSING; then
	echo "Failed TSlint checks"
	exit 1
else
	echo "TSlint checks passed"
fi

exit $?
