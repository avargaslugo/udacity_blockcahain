const bitcoin = require('bitcoinjs-lib') // v3.x.x
const bitcoinMessage = require('bitcoinjs-message')

acceptedDelay = 300


function currentTimestamp(){
  return Math.floor(Date.now() / 1000);
}


function requestResponse(address, timestamp){
  response =  {
    "address": address,
  "requestTimeStamp": timestamp,
  "message": address + ":" + timestamp + ":" + "starRegistry",
  "validationWindow": acceptedDelay
  }
  return response
}

function validSignatureResponse(address, whiteList){
  response =  {
  "registerStar": true,
  "status": {
    "address": address,
    "requestTimeStamp": whiteList[address]["requestTimeStamp"],
    "message": whiteList[address]["message"],
    "validationWindow": currentTimestamp()-whiteList[address]["requestTimeStamp"],
    "messageSignature": "valid"
  }
}
  return response
}



function checkExpirationInWhiteList(address, whiteList){
  console.log(address)
  initialTimeStamp = whiteList[address]["requestTimeStamp"]
  if (initialTimeStamp){
    let delay = currentTimestamp() - initialTimeStamp
    return delay <= acceptedDelay
  }
  else{return false}
}

function validateSignature(address, signature, whiteList){
  message = whiteList[address]["message"]
  // message for testing purposes
  console.log(message)
  return bitcoinMessage.verify(message, address, signature)
}

function validateBlockchainStarPayload(payload){
  if (payload.address == null){
    console.log("address not provided!!")
    return false
  }
  if (payload.star == null){
    console.log("no start information not provided!!")
    return false
  }

  if (payload.star["dec"] == null){
    console.log("no dec start information not provided!!")
    return false
  }

  if (payload.star["story"] == null){
    console.log("no start story provided!!")
    return false
  }
  if (payload.star["story"].split(" ").length > 250){
    console.log("start story provided is to long!!")
    return false
  }

return true
}




module.exports.requestResponse = requestResponse;
module.exports.checkExpirationInWhiteList = checkExpirationInWhiteList;
module.exports.validateSignature = validateSignature;
module.exports.validSignatureResponse = validSignatureResponse;
module.exports.validateBlockchainStarPayload = validateBlockchainStarPayload;
