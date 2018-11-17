/*
File contians routes to use for interactions with the blockchain
*/
const utils = require("./utils.js")
const helperfile = require("../helperfile.js");


function registerStarInBlockchain(blockChain, vaidatedAddresses){
  //function return a route definition for registering start in an already created blockchain
   return {
     method: 'POST',
     path: '/block',
     handler: (request, response) => {
       // body is initialized as being empty
       let payload = request.payload
       // validates if payload contains the needed data
       validPayload = utils.validateBlockchainStarPayload(payload)
       validAddress = vaidatedAddresses[payload.address]
       if((validAddress== null) || (Math.floor(Date.now() / 1000) - validAddress > utils.acceptedDelay)){
         return "Your address has not been validated or your validation expired; please restart whole process"
       }
      // if payload was valid
      if (validPayload==true)
      {
        star = payload["star"]
        // encodes start story
        star["story"] = Buffer.from(star["story"], 'utf8').toString('hex');
        body = {"address": payload.address, "star": star}
        // created new block with star information and address as body
        let b = new helperfile.Block(body)
        // adds new block
        resp = blockChain.addBlock(b)
        delete vaidatedAddresses[payload.address]
        return resp
      }
      // if payload was not valid
      else {
        return "Invalid payload!!!! \n"
      }
    }
  }
}


function getStartsFromAddress(blockChain){
  // function return a route to get stars from a created blockchain by address
  // it does this by iterating over the whole blockchain and only retreiving the blocks
  // which have the target address.
  return {
  method: 'GET',
  path: '/stars/address:{address}',
  handler: (request, h) => {
    var stars = blockChain.getBlockHeight().then(
      function(height){
        // initializes array of block start with the target address
        var blocs = []
        i=1
        // iterates over blockchain
        while(i<=height){
          //gets block i
          let b = blockChain.getBlock(i).then(function(bod){
            // parses body of block
            parsedBody = bod["body"]
            // checks if address is same as target
            if(parsedBody["address"]==request.params.address){
              // if address is same as target decodes story
              parsedBody["star"]["story"] = Buffer.from(parsedBody["star"]["story"], 'hex').toString('utf8');
              bod["body"] = parsedBody
              // return block
              return bod
            }
          })
        // append block to array
        blocs.push(b)
        i += 1
      }
      blocs = Promise.all(blocs).then(function(value){ return value})
      return blocs
    })
    // only use those blocks that have a value, those with the target address
    stars = stars.then(function(a){return a.filter(function(b){return b!=null})})
    return stars
    }
  }

}


function getStartsFromHash(blockChain){
  // method gets the star in the block with the target hash
  return {
  method: 'GET',
  path: '/stars/hash:{hash}',
  handler: (request, h) => {
    var stars = blockChain.getBlockHeight().then(function(height)
    {
      var blocs = []
      i=1
      while(i<=height){
        let b = blockChain.getBlock(i).then(function(bod){
          if(bod["hash"]==request.params.hash){
            parsedBody = bod["body"]
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
        if (request.params.blockNumber > 0){
          parsedBody = bod["body"]
          parsedBody["star"]["story"] = Buffer.from(parsedBody["star"]["story"], 'hex').toString('utf8');
          bod["body"] = parsedBody
        }
        return bod
      })
    }
  }
}

module.exports.registerStarInBlockchain = registerStarInBlockchain;
module.exports.getStartsFromAddress = getStartsFromAddress;
module.exports.getStartsFromHash = getStartsFromHash;
module.exports.getStartsFromBlock = getStartsFromBlock;
