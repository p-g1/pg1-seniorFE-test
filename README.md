## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.
<br/>
<br/>

**IMPLEMENTATION**

This application is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The application allows the user to generate a testnet HD Bitcoin wallet.
The user can see and copy the wallet address, mnemonic and private key.
The mnemonic and private key are hidden by default and can be revealed.

The user can then enter an amount of BTC to request payment for and add an optional message. The latter was included to give the user an opportunity to provide a reference or flag the testnet nature of the transaction to ensure no mishaps.

The user can then generate a QR code for the payment. The QR code is encoded with a BIP21 compliant URI.

The application then polls the [mempool.space](https://mempool.space/testnet4) API for testnet 4. This decision was made as testnet 3 is flagged as deprecated and tokens are much arder to come by.

Upon a transaction broadcast on the testnet to the user wallet, the application will display the transaction details. It will continue to poll for updates until the transaction is confirmed.

The polling is then cleared.
<br/>
<br/>

**DEPLOYMENT**

The application is deployed on Vercel [here](https://pg1-senior-fe-test.vercel.app).
<br/>
<br/>

**USER TESTING**

To manually test the functionality: start the application, generate a wallet and payment request QR Code. Scan the QR code with a testnet wallet (Sparrow wallet is recommended due to testnet 4 support) and broadcast the transaction.

This will populate the transaction details in the application.

If you require testnet 4 tokens, I have found the mempool.space [faucet](https://https://mempool.space/testnet4/faucet) works reliably.
<br/>
<br/>

**CODEBASE TESTING**

The codebase contains unit and integration tests and generates a test coverage report.

To run the tests:

```bash
npm run test
```

The test coverage report shows 100% coverage across the codebase.
<br/>
<br/>

**BROWSER TESTING**

The application was manually tested for cross-browser compatibility in Chrome, Safari, Brave and Firefox.
<br/>
<br/>

**PERFORMANCE**

Performance was tested using Lighthouse and Vercel Speed Insights.

Lighthouse scores:

- Performance: 100
- Accessibility: 100
- Best Practices: 100

Vercel Speed Insights:

- Real Experience Score: 98/100
  <br/>
  <br/>

**POTENTIAL IMPROVEMENTS**

- Add more network support

  - Right now the application only checks for testnet 4 transactions. Ideally you would offer the user a choice or poll across a range of networks.

- Use a local node or one we can control for polling rather than relying on a third party API.

  - This would be more reliable and reduce reliance on external services.

- Implement a design system like Chakra-UI to make more extensible and reusable components.

  - The size of the application right now makes this overkill, but it would be a good idea for future development if the application was to be extended.

- Offer the user more visibility on transaction progress

  - Provide number of confirmations and an amount matching indicator to improve credibility that the transaction represents a response to the request

- Multiple request tracking

  - Allow the user to create multiple QR payment codes and monitor them all. Perhaps by allowing the user to close the modal and have a reference list of requested payment links to watch.

- Increase cross-browser testing coverage

  - Using tools such as BrowserStack.

- Implement e2e tests with Cypress.
