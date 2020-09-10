const express = require('express')
const app = express()
const port = process.env.PORT || 80;

const BienIci = require('./site/BienIci');
const LeBonCoin = require('./site/LeBonCoin');
const OuestImmo = require('./site/OuestImmo');


const services = [BienIci, OuestImmo, LeBonCoin];

(async () => {
    // Show services status
    app.get('/', (req, res) => {
        const list = services.map(s => `<li><a href="/${s.name}">${s.name}</a></li>`);
        res.end(`<html><head><title>Estate</title></head><body><h4>Services :</h4><ul>${list.join('')}</ul></body></html>`);
    })

    // On every call, check all services and send notification if needed
    app.get('/cron', async (req, res) => {
        for (let s of services)
            await s.go();

        res.end('Ok !');
    })

    // Get status for one particular service
    app.get('/:serviceName', async (req, res) => {
        for (let s of services)
            if (s.name === req.params.serviceName)
                return res.end(`Service [${s.name}] is registered and ${s.started ? 'started' : 'stopped'}`);

        res.end(`Service not found (${req.params.serviceName})`);
    })

    // Call an operation (aka. function) on a particular service
    app.get('/:serviceName/:operation', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        for (let s of services)
            if (s.name === req.params.serviceName && !!s[req.params.operation]) {
                if (typeof s[req.params.operation] === "function") {
                    const result = s[req.params.operation]();
                    if (!!result.then)
                        return res.end(JSON.stringify(await result));
                    else
                        return res.end(JSON.stringify(result));
                } else
                    return res.end(JSON.stringify(s[req.params.operation]));
            }

        res.end(`Service or operation not found (${req.params.serviceName}#${req.params.operation})`);
    })

    app.listen(port)

    for (let s of services)
        await s.init();
})();

