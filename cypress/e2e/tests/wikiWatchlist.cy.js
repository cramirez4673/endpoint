/// <reference types="cypress" />
// e2e Cypress Tests
// Author: Carlos Ramirez

describe("Wikipedia watchlist functionality", function () {

    before(function () {
        // Clear browser cookies and storage
        cy.clearCookies
        cy.clearLocalStorage

        // Load fixture with the test data needed
        cy.fixture('testData.json').then(function (testData) {
            this.testData = testData
        })
    });

    it("Logs into Wikipedia account", function () {
        // Uncomment to load Wikipedia site using cypress.env.json to login
        cy.visit(Cypress.env('wikiUrl'))

         // Uncomment to use evn file
        // cy.logIn(`${Cypress.env('userName')}`, `${Cypress.env('userPassword')}`)

        // Uncomment to use a fixture file testData.json to login
        // cy.visit(this.testData.url);

        // Set uesername and password using a command with either an env file or a fixture file

        // Uncomment to use fixture file
        cy.logIn(this.testData.userName, this.testData.userPassword)       
    });

    it("Test 1 - Search for Elivs Presley and add to watchlist", function () {
        const serachItem1 = 'Elvis'

        // Wait for page to load and have the search field enabled
        cy.waitUntil(() => Cypress.$('[id="searchInput"]').length === 1, {
            timeout: 15000,
            interval: 200,
        }).then(() => {
            cy.get('[id="searchInput"]')
                .type(`${serachItem1}{enter}`)
        });

        // Verify heading artist name
        cy.waitUntil(() =>
            cy.get('[id="firstHeading"]'))
                .should('contain', "Elvis Presley"), {
                timeout: 15000,
                interval: 200,
        };

        // Need to click on Talk tab to see the watchlist icon
        cy.waitUntil(() => Cypress.$('[id="ca-talk"]').length === 1, {
            timeout: 15000,
            interval: 200,
        }).then(() => {
            cy.wait(1000)
            cy.get('[id="ca-talk"]').click()
            cy.wait(1000)
        });

        // Click watchlist button
        cy.get('[id="ca-watch"]', { timeout: 15000 }).click();

        // Verify success alert message for adding to watchlist
        cy.get('[class="oo-ui-widget oo-ui-widget-enabled oo-ui-labelElement oo-ui-labelElement-label oo-ui-labelWidget"]')
            .should('be.visible')
            .contains("and its associated page have been added to your");

        // Click Article tab
        cy.get('[id="ca-nstab-main"]').click();

        // Capture paragraph text for bouns test
        cy.get('[class$="navigation-not-searchable"]', { timeout: 15000 }).invoke('text').then(($text) => {
            const pgTxt = $text.substring(0, 35).replace(/"/g, '').trim()
            cy.log("Text From Artist WikiPage: " + pgTxt)
            cy.task('setPgText', pgTxt)
        });
    });

    it("Test 2 - Bouns test - Veirfy paragraph from first test", function () {
        // Use text from first test to verify here
        cy.task('getPgText').then((pgText) => {
            cy.log("Page Text: " + pgText)
            expect(pgText).to.eq("Elvis and King of Rock and Roll")
        });
    });

    it("Test 3 - Search new artist and add to watchlist", function () {
        const serachItem2 = 'Morrissey'

        // Search for new artist page
        cy.get('[id="searchInput"]', { timeout: 15000 })
            .type(`${serachItem2}{enter}`);

        // Verify heading name of artist
        cy.waitUntil(() =>
            cy.get('[id="firstHeading"]'))
            .should('contain', "Morrissey"), {
            timeout: 15000,
            interval: 200,
        };

        // Click on Talk tab to see the watchlist icon
        cy.waitUntil(() => Cypress.$('[id="ca-talk"]').length === 1, {
            timeout: 15000,
            interval: 200,
        }).then(() => {
            cy.wait(1000)
            cy.get('[id="ca-talk"]').click()
            cy.wait(1000)
        });

        // Click watchlist button
        cy.get('[id="ca-watch"]').click();

        // Verify success alert message for adding to watchlist
        cy.get('[class="oo-ui-widget oo-ui-widget-enabled oo-ui-labelElement oo-ui-labelElement-label oo-ui-labelWidget"]')
            .should('be.visible')
            .contains("and its associated page have been added to your")
    });

    it("Test 4 - Verify the watchlist page contains the expected pages added and remove from watchlist", function () {
        // Click on the Watchlist link
        cy.get('[id="pt-watchlist"]').click();

        // Click on the Edit your list of watch pages button
        cy.waitUntil(() => Cypress.$('[href="/wiki/Special:EditWatchlist"]').length === 1, {
            timeout: 15000,
            interval: 200,
        }).then(() => {
            cy.get('[href="/wiki/Special:EditWatchlist"]').click()
        });

        // Verify two pages where added
        cy.waitUntil(() => Cypress.$('[id="ooui-php-1"]').length === 1, {
            timeout: 15000,
            interval: 200,
        }).then(() => {
            cy.get('[title="Elvis Presley"]')
                .should('be.visible')

            cy.get('[title="Morrissey"]')
                .should('be.visible')
        });

        // Clicks on the checkbox for the first artist added
        cy.get('[value="Elvis Presley"]').click();

        // Click on the Remove titles button
        cy.get('[value="Remove titles"]').click();

        // Go back to watchlist
        cy.go('back');

        // Verify only one page is displayed
        cy.get('[type="checkbox"]').its('length').should('eq', 3);

        // Clicks on the the second artist
        cy.get('[href="/wiki/Morrissey"]').click();

        // Verify heading name of artist on article page
        cy.waitUntil(() =>
            cy.get('[id="firstHeading"]'))
            .should('contain', "Morrissey"), {
            timeout: 15000,
            interval: 200,
        };
    });

    it ("Delete the last page on watchlist to be able to rerun tests", function() {
        // Go back to watchlist
        cy.go('back');

        // Clicks on the checkbox for the first artist added
        cy.get('[value="Morrissey"]').click();

        // Click on the Remove titles button
        cy.get('[value="Remove titles"]').click();

        // Go back to watchlist
        cy.go('back');

        // Verify the empty state text on the watchlist page
        cy.contains("Titles on your watchlist are shown below."
        + " Entries shown in italics are redirects to a different Wikipedia page.")
    })
});
