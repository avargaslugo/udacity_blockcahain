
const helperfile = require('./helperfile.js');

const SHA256 = require('crypto-js/sha256');

class Blockchain {
    constructor() {
      this.initializeBlockChain()
    }
    // Blockchain initialization
    async initializeBlockChain() {
      /*
      Function initializes the block chain. If the block chain height is less than
      0 the blockchain does not have a genesis block and it adds it.
      */
      let height = await this.getBlockHeight()
      if (height < 0)
      {
        try {
            // // Get block height
            this.addBlock(new helperfile.Block('First block in the chain - Genesis block'));
            console.log('Genesis Block Added.');
        } catch (err) {
            console.log('Error while adding Genesis Block: ' + err);
        }
      }
    }

    // Add new block
    async addBlock(newBlock) {
      /*
      Function contains the necessary logic to add a new block to the block chain

      */
        try {
            // Block height
            let height = await this.getBlockHeight();
            newBlock.height = height + 1;
            // UTC timestamp
            newBlock.time = new Date().getTime().toString().slice(0, -3);
            if(newBlock.height > 0) {
                // Get previous block
                let previousBlock = await this.getBlock(newBlock.height - 1);
                // Previous block hash
                newBlock.previousBlockHash = previousBlock.hash;
                // Block hash with SHA256 using newBlock and converting to a string
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                // Adding block object to chain
                let response = await helperfile.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
                console.log(response);
            } else {
                // Block hash with SHA256 using newBlock and converting to a string
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                // Adding block object to chain
                let response = await helperfile.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
                console.log(response);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Get block height
    async getBlockHeight() {
        try {
            // Get height
            return await helperfile.getHeight();
        } catch (err) {
            console.log(err);
        }
    }

    // Get block
    async getBlock(blockHeight) {
        try {
            // Get block from Level db
            let block = await helperfile.getLevelDBData(blockHeight);
            // Return object as a single string
            return JSON.parse(block);
        } catch (err) {
            console.log(err);
        }
    }

    // Validate block

    // The point of this function is to see if the hash of a block is equal to
    // the hashed block content with out the hash it self.
    async validateBlock(blockHeight) {
        try {
            // Get block
            let block = await this.getBlock(blockHeight);
            // Get block hash
            let blockHash = block.hash;
            // Remove block hash to test block integrity
            block.hash = '';
            // Generate block hash
            let validBlockHash = SHA256(JSON.stringify(block)).toString();
            // Compare
            if (blockHash === validBlockHash) {
                console.log('Block # ' + blockHeight + ' is valid.');
                return true;
            } else {
                console.log('Block # ' + blockHeight + ' is  not valid!!!!!');
                console.log('Actual Hash: ' + blockHash + ' <> ' + validBlockHash);
                return false;
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Validate blockchain
    async validateChain() {
      /*
      This function validates the whole blockchain. This means, it checks:
      - The hash of every block is correct based on the block content.
      - The block connections are correct; the `previousBlockHash` attibute of a
      block is actually the hash for the previous block.
      */
        var errorLog = [];
        try {
            // Get block height
            let height = await this.getBlockHeight();
            for (var i = 0; i <= height; i++) {
                // Validate block
                let validateBlock = await this.validateBlock(i);
                if (!validateBlock)errorLog.push(i);
                // Compare blocks hash link
                if (i > 0) {
                    // Get current and previous block
                    let previousBlock = await this.getBlock(i-1)
                    let block = await this.getBlock(i)
                    if (previousBlock.hash != block.previousBlockHash) {
                        console.log('Block # ' + i + ' previousBlockHash: ' + block.previousBlockHash +
                            ' does not match with Block # ' + (i - 1) + ' hash: ' + previousBlock.hash);
                        errorLog.push(i);
                    }
                }
            }
            if (errorLog.length > 0) {
                console.log('Block errors = ' + errorLog.length);
                console.log('Blocks: ' + errorLog);
                return false;
            } else {
                console.log('No errors detected');
                return true;
            }
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports.Blockchain = Blockchain
