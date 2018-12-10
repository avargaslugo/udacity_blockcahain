pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';
// import "github.com/Arachnid/solidity-stringutils/strings.sol";

contract StarNotary is ERC721 {
  //using strings for *;
    struct Star {
        string name;
        string story;
        string Dec;
        string Mag;
        string Cent;

    }
    mapping(bytes32 => bool) public registeredStars;
    // mapping relates a token id to a specific star.
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // this mapping tells you which star is for sale at which price
    mapping(uint256 => uint256) public starsForSale;

    function createStarHashByCoordinates(string _Dec, string _Mag, string _Cent) internal pure returns (bytes32){
      return sha256(abi.encodePacked(_Dec, _Mag, _Cent));
    }

    function createStar(string _name, string _story, string _Dec, string _Mag, string _Cent ,uint256 _tokenId) public {
        // checks if star is registered or not based on coordinates
        require(!this.checkIfStarExist(_Dec, _Mag, _Cent), "star has already been registered");
        bytes32 starHash = createStarHashByCoordinates(_Dec, _Mag, _Cent);
        // registeres the star coordinates before minting
        registeredStars[starHash] = true;
        // creates new Star
        Star memory newStar = Star(_name, _story, _Dec, _Mag, _Cent);
        // assigns tokenID to star
        tokenIdToStarInfo[_tokenId] = newStar;
        // mint token
        mint(_tokenId);
    }

    function mint(uint256 _tokenId) internal{
      // make sure token has not been minted
      // require(super._tokenOwner[_tokenId] == address(0));
      super._mint(msg.sender, _tokenId);
    }

    function checkIfStarExist(string _Dec, string _Mag, string _Cent) public view  returns (bool){
      bytes32 starHash = createStarHashByCoordinates(_Dec, _Mag, _Cent);
      return registeredStars[starHash];
    }


    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
      // makes sure that sender own the start to be put on sale
      require(super.ownerOf(_tokenId) == msg.sender);
      // puts star for sale
      starsForSale[_tokenId] = _price;
    }

    function starsForSale(uint256 _tokenId) public view returns (uint256){
      return starsForSale[_tokenId];
    }

    function buyStar(uint256 _tokenId) public payable {
      // makes sure the intended star to buy is actually for sale
        require(starsForSale[_tokenId] > 0, "star is not for sale");
        // gets star price
        uint256 starCost = starsForSale[_tokenId];
        // gets star owner
        address starOwner = super.ownerOf(_tokenId);
        // makes sure that the money being paid is greater than the price
        require(msg.value >= starCost, "not enough to buy this is star");
        // transfers star from owner to buyer
        safeTransferFrom(starOwner, msg.sender, _tokenId);

        starOwner.transfer(starCost);
        delete starsForSale[_tokenId];
        // in case the buyer over paid, it gets the extra money back
        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public{
      require(_isApprovedOrOwner(_from, _tokenId));
      _clearApproval(_from, _tokenId);
      _removeTokenFrom(_from, _tokenId);
      _addTokenTo(_to, _tokenId);
      emit Transfer(_from, _to, _tokenId);
    }
}
