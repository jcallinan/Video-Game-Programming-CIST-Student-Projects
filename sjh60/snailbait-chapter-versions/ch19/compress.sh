#!/bin/bash
for f in `find . -name "*.css"`
   do
      echo 'Minifying and obfuscating ' $f
java -jar ~/Utilities/yuicompressor-2.4.7.jar $1 $f >> all.css
   done
for f in `find . -name "*.js"`
   do
      echo 'Minifying and obfuscating ' $f
      java -jar ~/Utilities/yuicompressor-2.4.7.jar $1 $f >> all.js
   done
