'use strict';

const http = require('http');
const getUserIP = require('user-ip');

/*
 * This Npm Uses Free Geo IP 's (freegeoip.net) service to provide users location 
 */

function getLocation(req, options) {

    return new Promise((resolve, reject) => {

        if (!req) {
            const error = new TypeError('Request Object Should Not Be Null Or Undefined');
            reject(error);
        }

        const userIP = getUserIP(req);
        const url = `http://ip-api.com/json/${userIP}`;

        if (!userIP) {
            const error = new TypeError('IP Address Should Not Be Empty');
            reject(error);
        }

        http.get(url, resStream => {
            let data = '';
            resStream.setEncoding('utf8');
            resStream.on('error', reject);
            resStream.on('data', chunk => data += chunk);
            resStream.on('end', () => {
                try {
                    const body = JSON.parse(data);

                    /*
                     * If status is fail should respond Bad Request (400)
                     */
                    if (body && (body.status === 'fail')) {
                        const error = new Error(body.status);
                        error.status = 400;
                        return reject(error);
                    }

                    resolve(body);
                } catch (error) {
                    reject(error);
                }
            });

        });

    });
}

module.exports = getLocation;