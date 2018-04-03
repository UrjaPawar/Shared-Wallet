var myWallet=artifacts.require("./MyWallet.sol");

contract("MyWallet",function(accounts){
    it("should be possible to put money inside", function(){
        var contractInstance;
        return myWallet.deployed().then(function(instance){
            contractInstance=instance;
            return contractInstance.sendTransaction({value:web3.toWei(10,"ether"), address:contractInstance.address, from: accounts[0]});
            }).then(function(tx){
                console.log("Amount Received: ",tx.logs[0].args._amount.toNumber());
                assert.equal(web3.eth.getBalance(contractInstance.address).toNumber(), web3.toWei(10,"ether"),"The balance is same");
            });
        });
    
    it("should be possible to get money back as an owner", function(){
        var walletInstance;
        var balanceBeforeSend;
        var balanceAfterSend;
        var amountToSend=web3.toWei(5,"ether");
        return myWallet.deployed().then(function(instance){
            walletInstance=instance;
            balanceBeforeSend=web3.eth.getBalance(instance.address).toNumber();
            return walletInstance.spendMoneyOn(accounts[0],amountToSend,"Coz I am the owner bitch!",{from: accounts[0]});
        }).then(function(){
            return web3.eth.getBalance(walletInstance.address).toNumber();
        }).then(function(balance){
            balanceAfterSend=balance;
            assert.equal(balanceBeforeSend-amountToSend,balanceAfterSend,"Balance is now 5 ether less than before");
        });
    });

    it('should be possible to propose and confirm sending money', function(){
        var walletInstance;
        return myWallet.deployed().then(function(instance){
            walletInstance=instance;
            return walletInstance.spendMoneyOn(accounts[1],web3.toWei(5,'ether'),'Coz I need money',{from: accounts[1]});
        }).then(function(tx){
            assert.equal(web3.eth.getBalance(walletInstance.address).toNumber(),web3.toWei(5,'ether'),"Balance is now 5 ether lesser");
            return tx.logs[0].args.proposal_id.toNumber();
        }).then(function(proposal_id){
            console.log("Proposal ID:", proposal_id);
            return walletInstance.confirmProposal(proposal_id,{from: accounts[0]});
        }).then(function(){
            var balance= web3.eth.getBalance(walletInstance.address).toNumber();
            assert.equal(balance,web3.toWei(0,"ether"),"BALANCE 0");
        })
    });

    /*
    // spendMoneyOn
    it('should be possible to propose and confirm spending money', function() {
        var walletInstance;
        return myWallet.deployed().then(function(instance) {
            walletInstance = instance;
            return walletInstance.spendMoneyOn(accounts[1], web3.toWei(5,'ether'), "Because I need money", {from: accounts[1]});
        }).then(function(transactionResult) {
            assert.equal(web3.eth.getBalance(walletInstance.address).toNumber(), web3.toWei(5, 'ether'), 'Balance is 5 ether less than before');
            var proposal_id = transactionResult.logs[0].args._counter.toNumber();
            return walletInstance.confirmProposal(proposal_id, {from: accounts[0]})
        }).then(function() {
          return web3.eth.getBalance(walletInstance.address).toNumber();
        }).then(function(balance) {
          assert.equal(balance, web3.toWei(0, 'ether'), 'Wallet balance is 0 now.');
        });
});*/

   

});