
import 'cypress-wait-until';

Cypress.Commands.add('logIn', (username, password) => {
     // Click on the Log In link
     cy.get('[id="pt-login"]').click()

     //Set Username and Password
     cy.waitUntil(() => Cypress.$('[id="wpName1"]').length === 1, {
         timeout: 15000,
         interval: 200,
     }).then(() => {
         cy.get('[id="wpName1"]').type(username)
         cy.get('[id="wpPassword1"]').type(password)
     }).then(() => {
         // Click Log in button
         cy.get('[id="wpLoginAttempt"]').click()
     })
})