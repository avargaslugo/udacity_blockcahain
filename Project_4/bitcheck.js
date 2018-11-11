var bitcoin = require('bitcoinjs-lib') // v3.x.x
var bitcoinMessage = require('bitcoinjs-message')


var keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss')
var privateKey = keyPair.privateKey
var message = 'This is an example of a signed message.'

var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')
console.log(signature.toString('base64'))
console.log(signature)
console.log(signature.toString('base64'))
var address = '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN'

console.log(bitcoinMessage.verify(message, address, signature.toString('base64')))
