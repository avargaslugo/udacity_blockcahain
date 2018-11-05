
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
var a = "dlkgfjlsdjf"
/*
Here we create the server routes
*/
//server.route(blockChainRESTAPI.getDefaultUrl());
//server.route(blockChainRESTAPI.getBlock(blockChain));
//server.route(blockChainRESTAPI.postBlock(blockChain));
let t = notaryRESTAPI.userRequestValidation(blockChain, addressWhiteListDict)


server.route(t);
console.log(addressWhiteListDict)
// starts server
init()
