#!/bin/sh

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep "\.ts$")

if [[ "$STAGED_FILES" == "" ]]; then
	exit 0
fi

PASSING=true

echo "\nRunning TSlint:\n";

which tslint &> /dev/null
if [[ "$?" == 1 ]]; then
	echo "Could not find TSlint. Try running 'yarn'"
	exit 1
fi

for FILE_NAME in $STAGED_FILES
do
	tslint "$FILE_NAME"

	if [[ "$?" == 0 ]]; then
		echo "TSlint check passed for: $FILE_NAME"
	else
		echo "TSlint check failed for: $FILE_NAME"
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
