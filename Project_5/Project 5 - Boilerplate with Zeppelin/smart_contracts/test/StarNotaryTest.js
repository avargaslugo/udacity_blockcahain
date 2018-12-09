const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => {

  name = 'Star power 103!'
  story = 'I love my wonderful star'
  ra = "ra_032.155"
  dec = "dec_121.874"
  mag = "mag_245.978"
  tokenId = 1
  owner = accounts[0]

    beforeEach(async function() {
        this.contract = await StarNotary.new({from: owner})
    })

    describe('can create a star', () => {
        it('can create a star and get its properties', async function () {
            await this.contract.createStar(name, story, dec, mag, ra, tokenId,{from: owner})
            star = await this.contract.tokenIdToStarInfo(tokenId);
            assert.equal(star[0].toString(), name);
            assert.equal(star[1].toString(), story);
            assert.equal(star[2].toString(), dec);
            assert.equal(star[3].toString(), mag);
            assert.equal(star[4].toString(), ra);
        })
    })

    describe('can tell if star exists', () => {
        it('can create a star and get its properties', async function (){
            assert.equal(await this.contract.checkIfStarExist(dec, mag, ra), false);
            await this.contract.createStar(name, story, dec, mag, ra, tokenId,{from: owner})
            assert.equal(await this.contract.checkIfStarExist(mag, ra, dec), false);
            assert.equal(await this.contract.checkIfStarExist(dec, mag, ra), true);
        })
    })

    describe('checking ownership', () => {
        it('can check ownership', async function (){
          user = accounts[1]
            await this.contract.createStar(name, story, dec, mag, ra, tokenId,{from: owner})
            assert.equal(await this.contract.ownerOf(tokenId, {from: owner}), owner);
            assert.notEqual(await this.contract.ownerOf(tokenId, {from: owner}), user);
        })
    })

    describe('checking if one can put star for sale and check its price', () => {
        it('can put star for sale and check its price', async function (){
          price=123
            await this.contract.createStar(name, story, dec, mag, ra, tokenId,{from: owner})
            await this.contract.putStarUpForSale(tokenId, price, {from:owner})
            assert.equal(await this.contract.starsForSale(tokenId), price)
            assert.equal(await this.contract.starsForSale(123), false)
        })
    })

    describe('checking if one can buy a star', () => {
        it('can purchase a star', async function (){
          price=123
          buyer = accounts[1]
            await this.contract.createStar(name, story, dec, mag, ra, tokenId,{from: owner})
            await this.contract.putStarUpForSale(tokenId, price, {from:owner})
            // makes sure the owner has the star
            assert.equal(await this.contract.ownerOf(tokenId), owner)
            // buyer buys the star
            await this.contract.buyStar(tokenId, {from:buyer, value: 123, gasPrice: 0})
            // makes sure now buyer owns the star
            assert.equal(await this.contract.ownerOf(tokenId), buyer)
            // assert star is not for sale anymore
            assert.equal(await this.contract.starsForSale(tokenId), false)
        })
    })

    describe('checking for approval', () => {
        it('can approve an address', async function (){
          approved = accounts[1]
          notApproved = accounts[2]
            await this.contract.createStar(name, story, dec, mag, ra, tokenId,{from: owner})
            await this.contract.approve(approved, tokenId, {from: owner})
            assert.equal(await this.contract.getApproved(tokenId), approved)
            assert.notEqual(await this.contract.getApproved(tokenId), notApproved)
        })
    })

    describe('checking for operator approval', () => {
        it('can approve an operator', async function (){
          aprovedOperator1 = accounts[1]
          aprovedOperator2 = accounts[2]
          notApprovedOperator = accounts[3]
            await this.contract.createStar(name, story, dec, mag, ra, tokenId,{from: owner})
            await this.contract.setApprovalForAll(aprovedOperator1, true, {from: owner})
            await this.contract.setApprovalForAll(aprovedOperator2, true, {from: owner})

            assert.equal(await this.contract.isApprovedForAll(owner, aprovedOperator1), true)
            assert.equal(await this.contract.isApprovedForAll(owner, aprovedOperator2), true)
            assert.equal(await this.contract.isApprovedForAll(owner, notApprovedOperator), false)

        })
    })

})
