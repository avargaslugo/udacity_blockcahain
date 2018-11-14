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
    //var blockNumber = 0
    //var a;
    var stars = blockChain.getBlockHeight().then(function(height)
    {
      var blocs = []
      i=1
      while(i<=height){
        let b = blockChain.getBlock(i).then(function(bod){
          parsedBody = JSON.parse(bod["body"])
          if(parsedBody["address"]==request.params.address){
            parsedBody["star"]["story"] = Buffer.from(parsedBody["star"]["story"], 'hex').toString('utf8');
            bod["body"] = parsedBody
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
    //var blockNumber = 0
    //var a;
    var stars = blockChain.getBlockHeight().then(function(height)
    {
      var blocs = []
      i=1
      while(i<=height){
        let b = blockChain.getBlock(i).then(function(bod){
          if(bod["hash"]==request.params.hash){
            parsedBody = JSON.parse(bod["body"])
            parsedBody["star"]["story"] = Buffer.from(parsedBody["star"]["story"], 'hex').toString('utf8');
            bod["body"] = parsedBody
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

function getStartsFromBlock(blockChain){
  return {
  method: 'GET',
  path: '/block/{blockNumber}',
  handler: (request, h) => {
    // reponse from the promise given by blockChain.getBlockHeight()
    let response = blockChain.getBlockHeight().then(
      // if resolved
      function(blockHeight){
        // if blockHeight is less than requiested block returns an error message
        if (request.params.blockNumber > blockHeight){
          msg = "Wrong request!! The Block you want hasn't been created. Current block height is " + blockHeight
          return msg
        }
        else{
          // retunr requested block
          return blockChain.getBlock(request.params.blockNumber)
        }
      }
    )
      return response.then(function(bod){
        parsedBody = JSON.parse(bod["body"])
        parsedBody["star"]["story"] = Buffer.from(parsedBody["star"]["story"], 'hex').toString('utf8');
        bod["body"] = parsedBody
        return bod
      })
    }
  }
}

module.exports.registerStarInBlockchain = registerStarInBlockchain;
module.exports.getStartsFromAddress = getStartsFromAddress;
module.exports.getStartsFromHash = getStartsFromHash;
module.exports.getStartsFromBlock = getStartsFromBlock;
