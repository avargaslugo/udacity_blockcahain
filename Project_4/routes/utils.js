const bitcoin = require('bitcoinjs-lib') // v3.x.x
const bitcoinMessage = require('bitcoinjs-message')

// accepted delay for all requests
acceptedDelay = 300

// function for getting the current time
function currentTimestamp(){
  return Math.floor(Date.now() / 1000);
}

// functio return a dictionary with the response for the inital request
function requestResponse(address, timestamp){
  response =  {
    "address": address,
  "requestTimeStamp": timestamp,
  "message": address + ":" + timestamp + ":" + "starRegistry",
  "validationWindow": acceptedDelay
  }
  return response
}
// function returns response for the signature validation request
function validSignatureResponse(address, whiteList){
  response =  {
  "registerStar": true,
  "status": {
    "address": address,
    "requestTimeStamp": whiteList[address]["requestTimeStamp"],
    "message": whiteList[address]["message"],
    "validationWindow": acceptedDelay - (currentTimestamp()-whiteList[address]["requestTimeStamp"]),
    "messageSignature": "valid"
  }
}
  return response
}


// function checks that requests are not submitted to late
function checkExpirationInWhiteList(address, whiteList){
  console.log(address)
  initialTimeStamp = whiteList[address]["requestTimeStamp"]
  if (initialTimeStamp){
    let delay = currentTimestamp() - initialTimeStamp
    return delay <= acceptedDelay
  }
  else{return false}
}

// function simply verifies if the message was signed witht the right address
function validateSignature(address, signature, whiteList){
  message = whiteList[address]["message"]
  return bitcoinMessage.verify(message, address, signature)
}

// function validates the that star registration payload has the necessary information in the right format
function validateBlockchainStarPayload(payload){
  if (payload.address == ""){
    console.log("address not provided!!")
    return false
  }
  if (payload.address == null){
    console.log("address not provided!!")
    return false
  }
  if (payload.star == null){
    console.log("no star information provided!!")
    return false
  }

  if (payload.star["dec"] == null){
    console.log("no star dec information not provided!!")
    return false
  }
  if (payload.star["ra"] == null){
    console.log("no star ra information not provided!!")
    return false
  }
  if (payload.star["story"] == null){
    console.log("no star story provided!!")
    return false
  }
  if (payload.star["story"].length > 500){
    console.log("start story provided is to long!!")
    return false
  }
  // check if all characters in string are ascci by making sure their int code is less than 127
  allAscii = payload.star["story"].split("").map(a => a.charCodeAt(0)<=127).reduce((a,b) => a&&b, true)
  if (!allAscii){
    console.log("There were non ascii characters in the story")
    return false
  }
return true
}

module.exports.requestResponse = requestResponse;
module.exports.checkExpirationInWhiteList = checkExpirationInWhiteList;
module.exports.validateSignature = validateSignature;
module.exports.validSignatureResponse = validSignatureResponse;
module.exports.validateBlockchainStarPayload = validateBlockchainStarPayload;
module.exports.acceptedDelay = acceptedDelay;
