
// use hapi to build our server
const hapi = require("hapi")
// use blockchain code from preivous project
const simpleChain = require("./simpleChain.js");
const helperfile = require("./helperfile.js");
const blockChainRESTAPI = require("./routes/blockChainRESTAPI.js")
const notaryRESTAPI = require("./routes/notaryRESTAPI.js")

// define server constants
const host = "localhost";
const port = 8000;

// creates a new block chain object
let blockChain = new simpleChain.Blockchain()
var addressWhiteListDict = {}

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
server.route(notaryRESTAPI.userRequestValidation(blockChain, addressWhiteListDict));
server.route(notaryRESTAPI.validateSignature(blockChain, addressWhiteListDict));
server.route(blockChainRESTAPI.registerStarInBlockchain(blockChain));
server.route(blockChainRESTAPI.getStartsFromAddress(blockChain));
server.route(blockChainRESTAPI.getStartsFromHash(blockChain));

init()
