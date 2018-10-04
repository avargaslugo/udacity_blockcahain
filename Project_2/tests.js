/*
This file contains various test fucntions used to check the main code
*/

const simpleChain = require("./simpleChain.js");
const helperfile = require("./helperfile.js");


// method for adding blocks to test; it adds n blocks to the block chain
async function createBlocks(n=20) {
    let height = await blockchain.getBlockHeight();
    for (var i = height + 1; i < height+n+1; i++) {
      await blockchain.addBlock(new helperfile.Block('This is block #' + i));
      
    }
}

// method for validating chain; simply calls the `validateChain` method
async function testChainValidation() {
    return blockchain.validateChain();
}

// method for introducing errros in the body of certian blocks
async function introduceErrorsInBlockBody(problemBlocks=[1,5,6,7]) {
    for (var i = 0; i < problemBlocks.length; i++) {
        let block = await blockchain.getBlock(problemBlocks[i]);
        block.body = 'isygl hdjksgh fhgjkldfhg';
        await helperfile.addLevelDBData(problemBlocks[i], JSON.stringify(block));
    }
}

// method for introducing errros the previous block hash
async function introduceErrorsInBlockPreviousHash(problemBlocks=[11,15,16,17]) {
    
    for (var i = 0; i < problemBlocks.length; i++) {
        let block = await blockchain.getBlock(problemBlocks[i]);
        block.previousBlockHash = 'isygl hdjksgh fhgjkldfhg';
        await helperfile.addLevelDBData(problemBlocks[i], JSON.stringify(block));
    }
}

// function creates blocs, validates the block chain, introduces errors and makes
// sure the errors are displayed when validating.
async function runAllTests(){
  await createBlocks();
  await testChainValidation();
  await introduceErrorsInBlockBody();
  await testChainValidation();
  await introduceErrorsInBlockPreviousHash();
  await testChainValidation();
}


let blockchain = new simpleChain.Blockchain();
runAllTests()

module.exports.createBlocks = createBlocks
module.exports.testValidateChain = testValidateChain

