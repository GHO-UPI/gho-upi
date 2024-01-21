# GHO-UPI
A Payment Facilitator for users to buy GHO Tokens using UPI and other Web2 Payment Services

## Setting up

First, you need to run the proxy server to handle payments: 
#### Move the proxy-server folder to a different location and run `npm i` and `node server.js`
Now the proxy payments server (Powered by Razorpay APIs) would be running at `port:3001`

#### Then Run the following commands to run your application on `localhost:3000`

```bash
npm i
npm run dev
```

## How to use

- Connenct your wallet using the Connect Wallet Button (Powered by ConnectKit)
- Ensure that the Network is `Sepolia ETH Testnet`
- Top up your Sepolia Eth Balance using Faucets
- Once the wallet is connected you can use the `Buy INR Tokens` Button and Pay with your desired Web2 Payments Method
- The Trade Option Can be used to Trade INR Tokens and get GHO Tokens
- The GHO Tokens will be minted to your address and reflected in your Metamask Wallet
- The Return Option can be used to Repay to borrowed GHO Tokens
- The GHO Tokens will be burnt from your wallet and converted back into INR Tokens
- You can use the Convert to FIAT option to checkout and withdraw your money from the platform
