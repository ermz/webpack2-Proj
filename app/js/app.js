const Web3 = require('web3');
const truffleContract = require('@truffle/contract');
const $ = require('jquery');
const metaCoinJson = require('../../build/contracts/MetaCoin.json');

//Instantiate web3 in a non-destructive way
if (typeof web3 !== 'undefined') {
	//web3.currentProvider == Metamask provider 
	window.web3 = new Web3(web3.currentProvider);
} else {
	//fallback option
	window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

const MetaCoin = truffleContract(metaCoinJson);
MetaCoin.setProvider(web3.currentProvider);

window.addEventListener('load', function() {
	return web3.eth.getAccount()
		.then(accounts => {
			if (accounts.length == 0) {
				$("#balance").html("N/A");
				throw new Error("No account with which to transact");
			}
			window.account = accounts[0];
			console.log("Account:", window.account);
			return web3.eth.net.getId();
		})
		.then(network => {
			console.log("Network:", network.toString(10));
			return MetaCoin.deployed()
		})
		.then(deployed => deployed.getBalance.call(window.account))
		.then(balance => $("balance").html(balance.toString(10)))
		.catch(console.error);
});