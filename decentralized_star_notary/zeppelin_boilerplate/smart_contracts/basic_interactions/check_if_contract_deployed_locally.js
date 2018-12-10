var Web3 = require("web3");
var assert = require('assert');
var url = 'HTTP://127.0.0.1:8545';
var address = '0xb11be35b571e91208ccb3108117cdb95af6ed433';
var addressWrong = '0xb11be35b571e91208ccb3108117cdb95af6ed434';

var web3 = new Web3(url);

web3.eth.getCode(address).then( function(a){ assert(a != "0x") } );
web3.eth.getCode(addressWrong).then( function(a){ assert(a == "0x") } );
