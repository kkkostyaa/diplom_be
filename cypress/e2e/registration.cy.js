import user from '../fixtures/user.json'

describe('Registering user ', () => {
    it('by  POST', () => {
        cy.request('POST', '/register', user).then(response => {
            expect(response.status).to.be.eq(201);
            console.log(response.body);
        })
    })

})