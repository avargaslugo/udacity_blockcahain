const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

acceptedDelay = 300


function currentTimestamp(){
  return Math.floor(Date.now() / 1000);
}


function requestResponse(address, timestamp){
  response =  {
    "address": address,
  "requestTimeStamp": timestamp,
  "message": address + ":" + timestamp + ":" + "starRegistry",
  "validationWindow": 300
  }
  return response
}

function checkExpirationInWhiteList(address, whiteList){
  initialTimeStamp = whiteList[address]
  if (initialTimeStamp){let delay = currentTimestamp() - whiteList[address]}
  else{return false}
  if (delay <= 300){return true}
  else{return false}

}


async function requestValidation(blockChainId, timestamp) {
    try {
        const request = await blockchainId.register(address);
        const expiration = time.checkExpiration(request.requestTimeStamp, blockchainId.INTERVAL);
        res.status(200).json({
            'address': request.address,
            'message': request.message,
            'timestamp': request.requestTimeStamp,
            'validationWindow': expiration.remaining,
        });
    } catch(err) {
        res.status(400).json({'error': `Could not register request: ${err}`});
    }
}

module.exports.requestResponse = requestResponse;
module.exports.checkExpirationInWhiteList = checkExpirationInWhiteList;
