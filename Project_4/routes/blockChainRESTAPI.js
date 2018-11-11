const utils = require("./utils.js")


//const simpleChain = require("./simpleChain.js");
const helperfile = require("../helperfile.js");

function getDefaultUrl(){
  return {
    method:'GET',
    path: '/',
    handler: (request, h) => {
      msg1 = "This is the blockchain interaction service. \n"
      msg2 = "To query a block add '/block/blockNumber' to the path in your browser"
      return msg1 + msg2
    }
  }
}

function getBlock(blockChain){

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
      return response
    }
  }

}



function postBlock(blockChain){
   return {
     method: 'POST',
     path: '/block',
     handler: (request, response) => {
       // body is initialized as being empty
       let body = ""
       try{
         // we try to re assign body to the payload
         body = request.payload.body
       }
       catch(err){
         // if body cannot be retrieved it is left as an empty string
        console.log("There was an error! Body Was not provided")
      }
      // if body is not empty
      if (body.length>0)
      {
        // created new block
        let b = new helperfile.Block(body)
        // adds new block
        blockChain.addBlock(b)
        // returns message that new block was added
        return  "Added New Block!!!! \n"
      }
      // if body is empty
      else {
        // returns message saying the block body is empty and does NOT add the block
        return "Empty Body Provided!!!! \n"
      }

    }
  }
}

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
    var stars = []
    var blockNumber = 0
    while(true){
      blockNumber += 1
      console.log(blockNumber)
      let response = blockChain.getBlockHeight().then(
        // if resolved
        function(blockHeight){
          // if blockHeight is less than requiested block returns an error message
          if (blockNumber > blockHeight){
            return false
          }
          else{
            // retunr requested block
            return blockChain.getBlock(blockNumber)
          }
        }
      )
      setTimeout(function() {console.log('Blah blah blah blah extra-blah');}, 3000);
      console.log(response)
      if (response==false){
        return stars
      }
      else{
        stars.push(response)
      }
    }


    }
  }

}


module.exports.getDefaultUrl = getDefaultUrl;
module.exports.getBlock = getBlock;
module.exports.postBlock = postBlock;
module.exports.registerStarInBlockchain = registerStarInBlockchain;
module.exports.getStartsFromAddress = getStartsFromAddress;
