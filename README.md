# GBC-Server-Signed-Transaction-Oracle
---

A contract to extract stock detail from offchain to onchain. This project works in the server side to sign a transaction object using the private key of an account.

## How to run the Project
1.  run `ganache-cli -d`
2.  connect the remix IDE to ganache using **web3 provider** option
3.  compile and deploy Stock.sol on remix
4.  copy and replace the contract address in index.js
5.  run `npm start` to start the application
6.  start [http://localhost:8080](http://localhost:8080) on a browser
7.  check the terminal to see the details of the signed transaction.
  