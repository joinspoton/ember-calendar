#!/bin/bash

rm -r dist
mkdir dist

cp src/calendar.css dist/calendar.css
cp src/calendar.js dist/calendar.js

yuicompressor dist/calendar.css > dist/calendar.min.css
closure-compiler --language_in ECMASCRIPT5 --js dist/calendar.js > dist/calendar.min.js