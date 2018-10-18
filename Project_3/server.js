
// use hapi to build our server
const hapi = require("hapi")
// use blockchain code from preivous project
const simpleChain = require("./simpleChain.js");
const helperfile = require("./helperfile.js");
// define server constants
const host = "localhost";
const port = 8000;
// create server
const server = hapi.server({host: host, port: port});

// this method initializes the server when called and send a notification
const init = async () => {
  await server.start();
  console.log('Server up and running at port: ' + port)
}

/*
Here we create the server routes
*/

// GET method for the default url
server.route({
method:
'GET',
path: '/',
handler: (request, h) => {
  msg1 = "This is the blockchain interaction service. \n"
  msg2 = "To query a block add '/block/blockNumber' to the path in your browser"
  return msg1 + msg2
  }
});

// GET method to get a give block by height
server.route({
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
});

/*
POST method to add new blocks to the block chain, the payload is the new block's
body
*/
server.route({
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
})
// creates a new block chain object
let blockChain = new simpleChain.Blockchain()
// starts server
init()
