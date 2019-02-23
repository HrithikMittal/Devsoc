'use strict';

const chai = require('chai').should();
const userIp = require('../');
const PORT = 3000;
const supertest = require('supertest');
const http = require('http');

function onBefore(done) {

    const server = http.createServer(function httpHandler(req, res) {
        const ip = userIp(req);
        const resData = JSON.stringify({ ip });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(resData);
    })

    server.listen(PORT, () => {
        console.log(`Server Started Successfully And Listening At Port ${PORT}`);
        done()
    });

}

describe('UserIP', () => {
    before(onBefore);
    
    it('should Successfully return users ip address', done => {
        const request = supertest('http://localhost:3000');
        request.get('/')
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);
                res.body.should.be.an('object');
                res.body.should.have.property('ip').and.not.to.be.empty;
                done();
            })

    })
})