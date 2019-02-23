'use strict';

const chai = require('chai').should();
const locateUser = require('../');

const ip = '1.1.1.1';
const mockReq = {
    headers: {},
    client: { remoteAddress: ip }
};

const expected = {
    query: '1.1.1.1',
    countryCode: 'AU',
    country: 'Australia',
    region: 'VIC',
    regionName: 'Victoria',
    city: 'Research',
    zip: '3095',
    timezone: 'Australia/Melbourne',
    lat: -37.7,
    lon: 145.1833,
    status: 'success'
};

const keys = Object.keys(expected);


describe('Locate User', () => {


    it('should Successfully return users location as json', done => {
        locateUser(mockReq)
            .then(data => {
                keys.forEach(key => data.should.have.property(key, expected[key]));
                done();
            })
            .catch(done);
    });


    it('should throw error with status 400 when status from IP API is fail', done => {

        /*
         * 127.0.0.1 .. querying this ip from IP API service will
         * result in fail status...
         */
        const mockReq = {
            headers: {},
            client: { remoteAddress: '127.0.0.1' }
        };

        locateUser(mockReq)
            .catch(error => {
                error.should.be.an.instanceof(Error);
                if (error.status === 400) {
                    done()
                } else {
                    done(error);
                }
            });
    });


})