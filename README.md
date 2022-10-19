# WebAutomation for endpoint

## Prerequisites for mac

You need to have the following installed to run the Cypress framework and tests

* Cypress
* node.js
* cypress-wait-until plugin

### 1. Install Cypress

From: `https://docs.cypress.io/guides/getting-started/installing-cypress`

Install Cypress via npm:

cd /your/project/path

npm install cypress --save-dev

### 2. Initiate Cypress

`npm init`

### 3. Open Cypress

`npx cypress open`

### 4. Install cypress-wait-until plugin

`npm i -D cypress-wait-until`

Next add the following to the cypress/support/commands.js file

`import 'cypress-wait-until';`

Then, in your test, you can use:
`cy.waitUntil(() => );`

## You're ready to run the tests in the framework
