# Project 3 RESTful Web API with Node.js Framework

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

In order to start running the notary server execute the following command

```
node notary.js
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

## GET /stars/hash:{hash}
### Description
Retrieves stars with decoded story from block with a specific hash
#### Example
In the browser go the the following address to retrieve the star from the block with a specific hash
```
http://localhost:8000/stars/hash:{hash}
```
#### Path parameter:`hash: string`

## GET /stars/address:{address}
### Description
Retrieves all stars with decoded story from a given address.
#### Example
In the browser go the the following address to retrieve the star from the block with a specific hash
```
http://localhost:8000/stars/address:{address}
```
#### Path parameter:`hash: string`


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


## POST /requestValidation
### Description
Requests a message to sign in order to register a star. One needs to provide the address of the star owner.

#### Example
```
curl -X POST \
  http://localhost:8000/api/requestValidation \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
    "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL"
}'
```
In case of a successful request the function will return a message to sign:

```
{
    "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "requestTimeStamp": "1541605128",
    "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
    "validationWindow": 300
}
```
