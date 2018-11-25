pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

  //TODO: add `hasPermission` that takes allowances into account including those of operators

    struct Star {
        string name;
        string Dec;
        string Mag;
        string Cent;
        string story;
    }
    // mapping that tell which is the address owning a given tocken.
    mapping(uint256 => address) tokenToOwner;
    // mapping tell you how many stars in total a given address has
    mapping(address => uint256) ownerToBalance;
    // mapping telling which users can spend a token even in they don't own it.
    mapping(uint256 => address) tokenToApproved;
    // tell which operators are allow to control all your star tokens
    mapping(address => mapping(address => bool)) ownerToOperator;

    // mapping relates a token id to a specific star.
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // this mapping tells you which star is for sale at which price
    mapping(uint256 => uint256) public starsForSale;

    // these maps are used to warranty the uniqueness of a star
    mapping(string => bool) public registeredDec;
    mapping(string => bool) public registeredMag;
    mapping(string => bool) public registeredCent;

    function createStar(string _name, string _Dec, string _Mag, string _Cent, string _story ,uint256 _tokenId) public {
        // checks if star is registered or not based on coordinates
        require(!this.checkIfStarExist(_Dec, _Mag, _Cent), "star has already been registered");
        // creates new Star
        Star memory newStar = Star(_name, _Dec, _Mag, _Cent, _story);
        // assigns tokenID to star
        tokenIdToStarInfo[_tokenId] = newStar;
        this.mint(_tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
      // makes sure that sender own the start to be put on sale
      require(this.ownerOf(_tokenId) == msg.sender);
      // puts star for sale
      starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
      // makes sure the intended star to buy is actually for sale
        require(starsForSale[_tokenId] > 0);
        // gets star price
        uint256 starCost = starsForSale[_tokenId];
        // gets star owner
        address starOwner = this.ownerOf(_tokenId);
        // makes sure that the money being paid is greater than the price
        require(msg.value >= starCost);
        // transfers star from owner to buyer
        this.safeTransferFrom(starOwner, msg.sender, _tokenId);

        //_removeTokenFrom(starOwner, _tokenId);
        //_addTokenTo(msg.sender, _tokenId);
        starOwner.transfer(starCost);
        // in case the buyer over paid, it gets the extra money back
        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(string _Dec, string _Mag, string _Cent) public returns (bool){
      return registeredDec[_Dec] && registeredMag[_Mag] && registeredCent[_Cent];
    }

    function mint(uint256 _tokenID) public {
      require(tokenToOwner[_tokenID] == address(0), "This token has already assigned");
      // assigns token to sender
      tokenToOwner[_tokenID] == msg.sender;
      ownerToBalance[msg.sender] += 1;
      // we transfer newly minted token to the sender address
      emit Transfer(address(0), msg.sender, _tokenID);
    }

    function ownerOf(uint256 _tokenID) public returns (address){
      return tokenToOwner[_tokenID];
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenID) external payable {
      //this makes sure only the owner of a given token can transfer it
      require(tokenToOwner[_tokenID] == msg.sender, "you have no ownership of this token");
      tokenToOwner[_tokenID] = _to;
      emit Transfer(_from, _to, _tokenID);
    }

    function approve(address _approved, uint256 _tokenID) external payable{
      require(tokenToOwner[_tokenID] == msg.sender, "you have no ownership of this token");
      // note that current implementation allows for single approval per token.
      tokenToApproved[_tokenID] == address;
      emit Approval(msg.sender, _approved, _tokenID);
    }

    function getApproved(uint256 _tokenID) public returns (address) {
      return tokenToApproved[_tokenID];
    }

    function SetApprovalForAll(address _operator, bool _approved) external{
      ownerToOperator[msg.sender][_operator] = _approved;
      emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function isApprovedForAll(address _owner, address _operator) public view returns (bool){
      return ownerToOperator[_owner][_operator];
    }

    function tokenIdToStarInfo(uint256 _tokenID) public {

      Star star = tokenIdToStarInfo[_tokenID];
      //[star.name, star.story, ]

    }

}
