const simpleChain = require("../Project_2/simpleChain.js")
const helperfile = require("../Project_2/helperfile.js")

async function createBlocks(n=20) {
    let height = await blockchain.getBlockHeight();
    for (var i = height + 1; i < height+n+1; i++) {
      await blockchain.addBlock(new helperfile.Block('This is block #' + i));

    }
}


let blockchain = new simpleChain.Blockchain();
createBlocks();
