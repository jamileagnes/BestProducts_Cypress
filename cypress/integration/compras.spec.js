/// <reference types="cypress"/>

describe('compras', () => {
    it('deve verificar produto', () => {
        cy.visit('http://localhost:3000/');
        cy.get('[class="sc-fzplWN dRYmQR"]').as('Rustic Metal Fish')
    });

    it('deve escolher produto', () => {
        cy.get('[class="sc-fznKkj krFriD"]').first().click()
    });

    it('deve conferir produto', () => {
        cy.get('[class="sc-AxmLO kuzbqu"]').click()
        cy.get('[class="sc-fzpkJw jxjcvX"]').as('Rustic Metal Fish')
    });

    it('deve finalizar compra', () => {
        cy.get('[class="sc-fzpmMD jqTlLt"]').as('Finalizar Compra').click()
    })
});