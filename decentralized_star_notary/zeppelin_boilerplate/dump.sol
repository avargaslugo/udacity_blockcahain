

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

function safeTransferFrom(address _from, address _to, uint256 _tokenID) external payable {
  //this makes sure only the owner of a given token can transfer it
  require(tokenToOwner[_tokenID] == msg.sender, "you have no ownership of this token");
  tokenToOwner[_tokenID] = _to;
  emit Transfer(_from, _to, _tokenID);
}
