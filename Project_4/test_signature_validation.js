var bitcoin = require('bitcoinjs-lib') // v3.x.x
var bitcoinMessage = require('bitcoinjs-message')
const http = require("http")

const message = '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN:1541938865:starRegistry'
var keyPair = bitcoin.ECPair.fromWIF('5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss')
var privateKey = keyPair.privateKey
var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')


const singatureValidationData = JSON.stringify(
  {
    "address": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN",
    "signature": signature
}
);

console.log(singatureValidationData)


const signatureValidationOptions = {
  hostname: 'localhost',
  port: 8000,
  path: '/message-signature/validate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    //'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(signatureValidationOptions, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  let body = ""
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(singatureValidationData);
req.end();
