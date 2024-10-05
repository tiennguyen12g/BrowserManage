## How to use C++ in Nodejs(electron)

1. npm install -g node-gyp
2. create binding.gyp 
code: {
    "targets":[
        {
            "target_name": "testAddon",
            "source": [
                "testAddon.cc"
            ]
        }
    ]
}
3. set up config
node-gyp configure.

4. run build
node-gyp build

node-gyp configure build

5. write in file .cc
#include <node_api.h>
if it throw an error, it means the node-api path is worng,
Click "Quick fix and edit path"
Go to C:\Users\tienn\AppData\Local\node-gyp\Cache\20.12.2\include\node
(please choose correct node version is current running),
Paste the path to : One argument per line.