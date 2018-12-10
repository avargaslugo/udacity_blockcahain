var fs = require('fs');
var Web3 = require("web3");
var assert = require('assert');

var abi = JSON.parse(fs.readFileSync('../build/contracts/StarNotary.json', 'utf8'))["abi"];


var url = 'HTTP://127.0.0.1:8545';
var address = '0xb11be35b571e91208ccb3108117cdb95af6ed433';
var addressWrong = '0xb11be35b571e91208ccb3108117cdb95af6ed434';

var web3 = new Web3(url);

web3.eth.defaultAccount = web3.eth.accounts[0];

var StarNotary = new web3.eth.Contract(abi, address)
