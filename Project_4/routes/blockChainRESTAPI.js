/*
File contians routes to use for interactions with the blockchain
*/
const utils = require("./utils.js")
const helperfile = require("../helperfile.js");

function registerStarInBlockchain(blockChain){
   return {
     method: 'POST',
     path: '/block',
     handler: (request, response) => {
       // body is initialized as being empty
       let payload = request.payload
       validPayload = utils.validateBlockchainStarPayload(payload)
       star = payload["star"]
       star["story"] = Buffer.from(star["story"], 'utf8').toString('hex');
       body = JSON.stringify({"address": payload.address, "star": star})

      // if body is not empty
      if (validPayload==true)
      {
        // created new block
        let b = new helperfile.Block(body)
        // adds new block
        resp = blockChain.addBlock(b)

        return resp
        // returns message that new block was added
        //return  "Added New Block!!!! \n"
      }
      // if body is empty
      else {
        // returns message saying the block body is empty and does NOT add the block
        return "Incomplete payload!!!! \n"
      }

    }
  }
}


function getStartsFromAddress(blockChain){

  return {
  method: 'GET',
  path: '/stars/address:{address}',
  handler: (request, h) => {
    // reponse from the promise given by blockChain.getBlockHeight()
    var blockNumber = 0
    var a;
    var stars = blockChain.getBlockHeight().then(function(height)
    {
      var blocs = []
      i=1
      while(i<=height){
        let b = blockChain.getBlock(i).then(function(bod){
          if(JSON.parse(bod["body"])["address"]==request.params.address){
            return bod
          }
          })
        blocs.push(b)
        i += 1
      }
      blocs = Promise.all(blocs).then(function(value){ return value})
      return blocs
    })
    stars = stars.then(function(a){return a.filter(function(b){return b!=null})})
    return stars
    }
  }

}


function getStartsFromHash(blockChain){
  return {
  method: 'GET',
  path: '/stars/hash:{hash}',
  handler: (request, h) => {
    // reponse from the promise given by blockChain.getBlockHeight()
    var blockNumber = 0
    var a;
    var stars = blockChain.getBlockHeight().then(function(height)
    {
      var blocs = []
      i=1
      while(i<=height){
        let b = blockChain.getBlock(i).then(function(bod){
          if(bod["hash"]==request.params.hash){
            return bod
          }
          })
        blocs.push(b)
        i += 1
      }
      blocs = Promise.all(blocs).then(function(value){ return value})
      return blocs
    })
    stars = stars.then(function(a){return a.filter(function(b){return b!=null})[0]})
    return stars
    }
  }
}

module.exports.getDefaultUrl = getDefaultUrl;
module.exports.getBlock = getBlock;
module.exports.postBlock = postBlock;
module.exports.registerStarInBlockchain = registerStarInBlockchain;
module.exports.getStartsFromAddress = getStartsFromAddress;
module.exports.getStartsFromHash = getStartsFromHash;
