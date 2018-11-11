/* ============= Persist data with LevelDB =============
|  Learn more: level - https://github.com/Level/level  |
===================================================== */

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);


// Add data to levelDB as key/value pair; ideally key should be the block height.
// This fucntion is generic, can be used for any object in LevelDB
// maybe this fucntion can be modified to make use of the original funcitons
async function addLevelDBData(key, value){
    return new Promise(function(resolve, reject) {
      // saves block to LevelDB
        db.put(key, value, function(err) {
            if (err) {
              // in case of an error show this message
                console.log('Failed to save Block: ' + key , err);
                reject(err);
            } else {
              // in case of successful save show this message
                resolve(value);
            }
        });
    });
}

// Get data from levelDB with key, for our purpose key should be block height
// This fucntion is generic, can be used for any object in LevelDB
async function getLevelDBData(key) {
    return new Promise(function(resolve, reject) {
        db.get(key, function(err, value) {
            if (err) {
                console.log('Not found!', err);
                reject(err);
            } else {
                resolve(value);
            }
        });
    });
}

// Add data to levelDB with value
async function addDataToLevelDB(value) {
  /*
  Function gets the current blockchain height and saves `value` with the key
  currentHeight + 1
  */
    let currentHeight = await getHeight()
    addLevelDBData(currentHeight+1, value)
}


// Get the height of blockchain
async function getHeight() {
  /*intial value is -1, corresponding to an empty block chain.
  i will increase by one as long as there are more keys stored in LevelDB.
  once there is no further keys, the stream is closed and we resolve the final
  value for i */
  let i = -1
    return new Promise(function(resolve, reject) {
        db.createKeyStream().on('data', function(data) {
            i++;
        }).on('error', function(err) {
            console.log('Error: ' + err);
            reject(err);
        }).on('close', function() {
            resolve(i);
        });
    });
}

/* ============= Block Definition =============
Here we define our block model. We do this here to leave the Blockchain logic
in a different file.
===================================================== */

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}



module.exports.addLevelDBData = addLevelDBData;
module.exports.getLevelDBData = getLevelDBData;
module.exports.addDataToLevelDB = addDataToLevelDB;
module.exports.getHeight = getHeight;
module.exports.Block = Block
