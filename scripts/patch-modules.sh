#!/bin/bash
#
# Temporary solutions and workarounds for updated node_modules

DIR=$(dirname $(realpath "$0"))

# Fix maxLeafTris deprecation
sed -i 's/maxLeafTris: 1,/maxLeafSize: 1,/g' "$DIR/../src/modules/three-gpu-pathtracer/build/index.module.js"

echo "done"
