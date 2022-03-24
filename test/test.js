// const { expect } = require('chai');
const chai = require('chai');
const chaihttp = require('chai-http');
// const { response } = require('express');
// const { sendStatus, send } = require('express/lib/response');
// const res = require('express/lib/response');
// const { object } = require('mongoose/lib/utils');

// const expect = require('expect');
const { header } = require('express/lib/request');
const { json, status } = require('express/lib/response');
const res = require('express/lib/response');
const sign = require('jsonwebtoken/sign');
// const { String } = require('mongoose/lib/schema/index');
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

        it('it should not get all the articles when a wrong url is used', (done) => {
            chai.request(server)
                .get('/marticles')//writing a wrong endpoint to test our api
                .end((err,response) => {
                    response.should.have.status(404);
                    // response.body.should.be.a('array');
                done()    
                })
        })
    })

    // Test the post (token login) route(been having errors reading null properties)

    // works perfectly using postman(received a token after post request)

    describe('POST /articles/login', () => {

        it('it should send a token', (done) => {
          
            chai.request(server)
                .post('/articles/login')
                // .send({
                //     id: 1,
                //     username: "anyuser",
                //     email: "anyuser@email.com",
                // })
                // .expect(200)
                // .expect((res) => {
                //     expect(res.headers['x-auth']).not.toBeNull();
                // })
                .end((err,response) => {

                    response.should.have.status(200);
                    response.body.should.be.a('object');

                done()
                })
            
        })
        it('it should send an error', (done) => {
          
            chai.request(server)
                .post('/articles/login')

                const username = {
                    id: 1,
                    username: "manyuser",
                    email: "manyuser@email.com",
                }
                const musername = {
                    id: 2,
                    username: "smanyuser",
                    email: "smanyuser@email.com",
                }

                sign({username,musername}, 'secretkey', (err,res) => {

                    // res.should.have.status(200);

                    if (username !== musername) {
                        res.status(403)
                    } else {
                        status(200)
                    }
                })


                // sign({username}, 'secretkey', (err,response) => {

                //     // response.should.have.status(400);

                //     if (err) {
                //         status(403)
                //     } else {
                //         status(200)
                //     }
                // })
                done()
                // })
            
        })
    })

    //test the patch (json) route
})