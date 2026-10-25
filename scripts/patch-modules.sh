#!/bin/bash
#
# Temporary solutions and workarounds for updated node_modules

DIR=$(dirname $(realpath "$0"))

# Fix maxLeafTris deprecation + maxLeafSize deprecation
sed -i 's/maxLeafTris: 1,/maxLeafSize: 1,/g' "$DIR/../src/modules/three-gpu-pathtracer/build/index.module.js"
sed -i 's/maxLeafSize: 1,/targetLeafSize: 1,/g' "$DIR/../src/modules/three-gpu-pathtracer/build/index.module.js"

# Fix Source deprecation
sed -i 's/, Source,/, TextureSource,/g' "$DIR/../src/modules/three-gpu-pathtracer/build/index.module.js"
sed -i 's/new Source/new TextureSource/g' "$DIR/../src/modules/three-gpu-pathtracer/build/index.module.js"

echo "done"
