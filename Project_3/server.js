
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



// GET method to get a give block by height
server.route({
method: 'GET',
path: '/block/{blockNumber}',
handler: (request, h) => {
  // retrives blockNumber from blockchain
  let block = blockChain.getBlock(request.params.blockNumber)
  //return "This is block number " + encodeURIComponent(request.params.blockNumber)
  return block
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
    // gets variable body from payload
    let body = request.payload.body
    // if body is not empty
    if (body.length>0)
    {
      // created new block
      let b = new helperfile.Block(p)
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
