var express = require('express');
var router = express.Router();
const Web3 = require('web3');
var Tx = require('ethereumjs-tx');
const fetch = require('node-fetch');
 
var contractAddr = '0x7d3D9053Da17A3e6Ef840Eb0A29beeDB6FEe2e07';
var abi =
 [
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "symbol",
				"type": "bytes4"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "volume",
				"type": "uint256"
			}
		],
		"name": "setStock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "symbol",
				"type": "bytes4"
			}
		],
		"name": "getStockPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "symbol",
				"type": "bytes4"
			}
		],
		"name": "getStockVolume",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const stock = {};

async function init() {
  var TxObj = Tx.Transaction;
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  web3.eth.getAccounts(console.log);
  let contractInstance = new web3.eth.Contract(abi, contractAddr);
  console.log("contractInstance");
 
  const account = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';
  const privateKey = Buffer.from('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d', 'hex');
//const newAddress = '0x5aB5E52245Fd4974499aa625709EE1F5A81c8157';
//var TestContract = new web3.eth.Contract([YOUR_ABI], contractAddress);
  const symbol = web3.utils.utf8ToHex(stock.symbol);
  const price = parseInt(stock.price);
  const volume = parseInt(stock.volume);

  const _data = await contractInstance.methods.setStock(symbol, price, volume).encodeABI();
  console.log(_data);
  var rawTx = {};
  web3.eth.getTransactionCount(account).then(nonce => {
    rawTx = {
      nonce: nonce,
      gasPrice: '0x20000000000',
      gasLimit: '0x181090',
      to: contractAddr,
      value: 0,
      data: _data
    }

    var tx = new TxObj(rawTx);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();
 
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log);

  });
}


/* GET home page. */
router.get('/', async function(req, res, next) {
  const response = await fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo');
  const rawStocks = await response.json();
  stock.symbol = rawStocks['Global Quote']['01. symbol'];
  stock.price =  rawStocks['Global Quote']['05. price'];
  stock.volume =  rawStocks['Global Quote']['06. volume'];
  console.log(stock);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(stock));
  init();
  //res.render('index', { title: 'Express' });
});


module.exports = router;
