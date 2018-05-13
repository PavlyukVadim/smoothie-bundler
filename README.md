# smoothie-bundler
A tool to bundle js files. Designed to produce the smallest file size possible.

#usage
##### Build project: 
node ./src/lib/index.js -i ./demo/src/index.js -o demo/build.js
##### DEBUG mode:
DEBUG=tree* node ./src/lib/index.js -i ./demo/src/index.js -o demo/build.js
#### Save dependency-tree:
node ./src/lib/index.js --graph -i ./demo/src/index.js -o demo/graph.json
