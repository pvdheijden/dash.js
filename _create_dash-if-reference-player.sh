#! /bin/bash

set -x
set -e

#npm install
npm run build

PLAYER="dash-if-reference-player"

pushd samples/$PLAYER

rm -rf dist && mkdir dist
cp -r ../../dist . 
sed -i 's|../../dist|dist|' index.html

rm -rf contrib && mkdir -p contrib/akamai/controlbar
cp -r ../../contrib .
sed -i 's|../../contrib|contrib|' index.html

popd

tar --directory=samples -cf dash-if-reference-player.tar $PLAYER
gzip dash-if-reference-player.tar