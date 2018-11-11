const utils = require("./utils.js")

function userRequestValidation(blockChain, addressWhiteListDict){
   return {
     method: 'POST',
     path: '/requestValidation',
     handler: (request, response) => {
       // body is initialized as being empty
       let address = ""
       try{
         // we try to re assign body to the payload
         address = request.payload.address
       }
       catch(err){
         // if body cannot be retrieved it is left as an empty string
        console.log("There was an error! BlockChain ID was not provided")
      }
      // if body is not empty
      if (address.length>0)
      {

        timestamp = Math.floor(Date.now() / 1000);
        response = utils.requestResponse(address, timestamp)
        addressWhiteListDict[address] = response
        console.log(addressWhiteListDict)
        return response
      }
      // if body is empty
      else {
        // returns message saying the block body is empty and does NOT add the block
        return "Empty Body Provided!!!! \n"
      }

    }
  }
}


function validateSignature(blockChain, addressWhiteListDict){
   return {
     method: 'POST',
     path: '/message-signature/validate',
     handler: (request, response) => {
       // body is initialized as being empty
       let signature = ""
       let address = ""
       try{
         // we try to re assign body to the payload
         signature = request.payload.signature
         address = request.payload.address
       }
       catch(err){
         // if body cannot be retrieved it is left as an empty string
        console.log("There was an error! BlockChain ID was not provided")
      }
      // if body is not empty
      if (signature.length>0)
      {
        onTime = utils.checkExpirationInWhiteList(address, addressWhiteListDict)
        if(!onTime){
          return "It took too long or you used the wrong address, please start again in necessary"
        }
        validSignature = utils.validateSignature(address, signature, addressWhiteListDict)
        if (validSignature==true){
          resp = utils.validSignatureResponse(address, addressWhiteListDict)
          console.log(resp)
          return resp
        }
        else {
          return "Message signature validation failed. Please restart process again."
        }

      }
      // if body is empty
      else {
        // returns message saying the block body is empty and does NOT add the block
        return "Empty Body Provided!!!! \n"
      }

    }
  }
}





module.exports.userRequestValidation = userRequestValidation;
module.exports.validateSignature = validateSignature;
