const chai = require('chai');
const chaihttp = require('chai-http');
const { response } = require('express');
// const { it } = require('mocha');
const server = require('../app');

//assertion type
chai.should()

chai.use(chaihttp);

describe('Rest api', () => {

    // Test the get articles route

    describe('GET /articles', () => {
        it('it should get all the articles json file', (done) => {
            chai.request(server)
                .get('/articles')
                .end((err,response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                done()    
                })
        })
    })



    // Test the post (token login) route


    //test the patch (json) route
})