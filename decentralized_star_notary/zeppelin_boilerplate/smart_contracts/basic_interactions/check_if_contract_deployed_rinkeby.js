var Web3 = require("web3");
var assert = require('assert');
var url = 'https://rinkeby.infura.io/v3/df52c8543c084c78a9dd90cd46ca3752';
var address = '0xd8b67ca46a263790e14db4a3a404ec7d842038af';
var addressWrong = '0xb11be35b571e91208ccb3108117cdb95af6ed434';

var web3 = new Web3(url);

web3.eth.getCode(address).then( function(a){
  assert(a != "0x");
  console.log("Contract correctly found!")
} );

web3.eth.getCode(addressWrong).then( function(a){
  assert(a == "0x");
  console.log("Contract correctly not found")
 } );
