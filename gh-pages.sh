#!/bin/bash

set -e # Terminate this script as soon as any command fails

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR

git checkout gh-pages
git rebase master

gulp build

cp dist/* .

echo "Build successful."
