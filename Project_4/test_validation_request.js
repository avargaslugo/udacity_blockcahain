
const http = require("http")


// request Validation
const requestValidationData = JSON.stringify(
  {"address": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN"}
);

const requestValidationOptions = {
  hostname: 'localhost',
  port: 8000,
  path: '/requestValidation',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    //'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(requestValidationOptions, (res) => {
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

req.write(requestValidationData);
req.end();
