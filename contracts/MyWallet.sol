pragma solidity ^0.4.18;

import "./mortal.sol";

contract MyWallet is mortal {
    address creator;
    uint256 myNumber;
    
    struct proposal{
        address _from;
        address _to;
        uint256 _value;
        string _reason;
        bool sent;
    }
    // default value of string is null and int is 0
    uint256 proposal_ctr;
    // no of proposals
    mapping(uint256 => proposal) m_proposals;

    event receivedFunds(address indexed _from, uint256 indexed _amount);
    event proposalReceived(address indexed _from, address indexed _to, string reason, uint256 proposal_id);
    
    function spendMoneyOn(address _to, uint256 _value, string _reason) public returns (uint256) {
        if(owner==msg.sender){
            bool sent=_to.send(_value);
            if(!sent){
                revert();
            }}
            else{
                proposal_ctr+=1;
                m_proposals[proposal_ctr]=proposal(msg.sender, _to,_value,_reason,false);
                proposalReceived(msg.sender,_to,_reason,proposal_ctr);
                return proposal_ctr;
            }
        }
        
    function confirmProposal(uint256 proposal_id) onlyowner public returns (bool){
        proposal _proposal=m_proposals[proposal_id];
        // the below condition checks if we aren't checking the "not real" proposals whose add value is defaulted to address(0)
        if(_proposal._from!=address(0)){
            if(_proposal.sent!=true){
                if(_proposal._to.send(_proposal._value)){
                    _proposal.sent=true;
                    return true;
                }
                return false;
            }
        }
    }
    

    function() payable public {
        if (msg.value>0) {
            receivedFunds(msg.sender, msg.value);
        }
    }
}
