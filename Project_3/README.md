# Project 3 RESTful Web API with Node.js Framework sdahfilusdhf

This is the third project for the blockchain Udacity nanoDegree. The idea is to build a RESTful API to interact with the private blockchain from project2. The goal is to be able to get block data and add blocks to the blockchain by
using this APi. In order to build the API I used hapi.js.


### Prerequisites

In order to run the code one needs to install the following dependencies

```
npm install --save level
npm install --save crypto-js
npm install --save hapi
```

### Running the server

In order to start running the server execute the following command

```
node server.js
```


# API Documentation

`Content-Type` header for all requests is `application/json`.

## GET /block/{blockHeight}
### Description
Retrieves blockHeight from block chain
#### Example
In the browser go the the following address to retrieve the genesis block
```
http://localhost:8000/block/0
```
#### Path parameter:`blockHeight: Number`
The following path will return the block blockHeight
```
http://localhost:8000/block/blockHeight
```

In case of a successful query the representation of block will be displayed for example
```
http://localhost:8000/block/0
```
will return
```
{
  "hash":"0bc06f012073f0ef32689ba83791c81da8a35656c0ab92b5f8720604d1578855",
  "height":0,
  "body":"First block in the chain - Genesis block",
  "time":"1538591112",
  "previousBlockHash":""
}
```


## POST /block
### Description
Creates a new block where the body is the payload of the request. The payload parameter should be called body, for example:

```
'{"body":"Dummy block to test API"}'
```
#### Example
```
curl -X POST \
  http://localhost:8000/block \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{"body":"Dummy block to test API"}'
```
In case of a successful response the function will return a message confirming the creation of the new block. In case of the providing an empty body, the function will return a message indicating the invalid input and will not create a new block.
