import user from "../fixtures/user.json";
import {faker} from '@faker-js/faker';

let post =   {
    "userId": 100,
    "title": faker.random.words(5),
    "body": faker.lorem.paragraph(1)
}

describe('User can', () => {

    it('view all posts by GET', () => {
        cy.request('GET', '/posts').then(response => {
            expect(response.status).to.be.eq(200);
            expect(response.headers['content-type']).to.be.eq('application/json; charset=utf-8');
        })
    })

    it('view 10 first posts by GET', () => {
        cy.request('GET', '/posts?_limit=10').then(response => {
            expect(response.status).to.be.eq(200);
            expect(response.body.length).to.be.eq(10);
        })
    })

    it('get posts id=55 and id=60 by GET', () => {
        cy.request('GET', '/posts?id=55&id=60').then(response => {
            expect(response.status).to.be.eq(200);
            const post_ids = [];

            response.body.forEach(post => {
                post_ids.push(post.id)
            })
            expect(post_ids[0]).to.be.eq(55);
            expect(post_ids[1]).to.be.eq(60);
        })
    })

    it('create a post by POST', () => {
        cy.request({
            method: 'POST',
            url: 'posts',
            body: post,
        }).then(response => {
            expect(response.status).to.be.eq(201);
            expect(response.body.userId).to.be.eq(post.userId);
            expect(response.body.title).to.be.eq(post.title);
            expect(response.body.body).to.be.eq(post.body);
        })
    })

    it('try to patch a not-existing post via PATCH', () => {
        cy.request({
            method: 'PATCH',
            url: 'posts/300',
            body: post,
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.be.eq(404);
        })
    })

    it('create a post by POST and UPDATE', function() {
        let postId;
        cy.request({
            method: 'POST',
            url: 'posts',
            body: post,
        }).then(response => {
            expect(response.status).to.be.eq(201);
            postId = response.body.id;
            expect(response.body.userId).to.be.eq(post.userId);
            expect(response.body.title).to.be.eq(post.title);
            expect(response.body.body).to.be.eq(post.body);
        }).then(()=> {
            cy.request({
                method: 'PATCH',
                url: `posts/${postId}`,
                body: {
                    "title": 'title_updated'
                },
            }).then(response => {
                expect(response.status).to.be.eq(200);
                expect(response.body.title).to.be.eq('title_updated')
            })
        })
    })

    it('try to a not-existing post via DELETE', () => {
        cy.request({
            method: 'DELETE',
            url: 'posts/300',
            body: post,
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.be.eq(404);
        })
    })

    it('create a post via POST + UPDATE + DELETE', function() {
        let postId;
        cy.request({
            method: 'POST',
            url: 'posts',
            body: post,
        }).then(response => {
            expect(response.status).to.be.eq(201);
            postId = response.body.id;
            expect(response.body.userId).to.be.eq(post.userId);
            expect(response.body.title).to.be.eq(post.title);
            expect(response.body.body).to.be.eq(post.body);
        }).then(()=> {
            cy.request({
                method: 'PATCH',
                url: `posts/${postId}`,
                body: {
                    "title": 'title_updated'
                },
            }).then(response => {
                expect(response.status).to.be.eq(200);
                expect(response.body.title).to.be.eq('title_updated')
            })
        }).then(()=> {
            cy.request({
                method: 'DELETE',
                url: `posts/${postId}`,
            }).then(response => {
                expect(response.status).to.be.eq(200);
            })
        }).then(()=> {
            cy.request({
                method: 'GET',
                url: `posts/${postId}`,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.be.eq(404);
            })
        })
    })

    it.skip('login via POST', () => {
        let accessToken;

        const payload = {
            "email": user.email,
            "password": user.password}

        cy.request({
            method: 'POST',
            url: '/login',
            body: payload,
            })
            .then(response => {
                expect(response.status).to.be.eq(200);
                accessToken = response.body.accessToken;
            }).then(()=> {
            cy.request({
                method: 'POST',
                url: '664/posts',
                body: post,
                headers: {
                    Token: accessToken
                }
            }).then(response => {
                expect(response.status).to.be.eq(200);
            })
        })
    })
})