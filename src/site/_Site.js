const c = require('chalk');
const fs = require('fs');
const Sms = require('../util/Sms')
const R = require('request-promise-native')
const os = require('os')
const path = require('path')

/**
 * Parent class for all Site
 * @type {Site}
 */
module.exports = class Site {

    /**
     * @param name Name of the site
     * @param apiURL Base api endpoint
     * @param isPost if true, call using POST. GET otherwise.
     * @param filters Body sent to the API
     * @param json Is the body JSON encoded ?
     */
    constructor(name, apiURL, isPost, filters, json) {
        this.name = name;
        this.apiUrl = apiURL;
        this.isPost = isPost;
        this.filters = filters;
        this.json = json;
        this.dataFile = path.join(process.env.DEBUG ? './data/' : os.tmpdir(), this.name + '.json');
        this.data = null;
        this.started = true;
        this.logPrefix = c.blue(`[${this.name}] `);

        this.log('data file: ' + this.dataFile);
    }

    /**
     * Initialise the Site
     * @returns {Promise<void>}
     */
    async init() {
        // Data file store all already notified estate (there ID)
        if (!fs.existsSync(this.dataFile)) {
            this.log('Building initial data')
            const estates = await this.doRequest();
            this.data = {
                seen: estates.map(this.extractIdFromEstate)
            }

            fs.writeFileSync(this.dataFile, JSON.stringify(this.data, null, 2));
        } else {
            this.log('Loading last data')
            this.data = JSON.parse(fs.readFileSync(this.dataFile));
        }

        this.log('Done')
    }

    /**
     * Check for new estate
     * @returns {Promise<void>}
     */
    async go() {

        if(!this.started)
            return;

        try {
            const estates = await this.doRequest();
            const newEstates = estates
                .filter(e => !(this.extractIdFromEstate(e) === undefined || this.extractIdFromEstate(e) === null))
                .filter(e => this.data.seen.indexOf(this.extractIdFromEstate(e)) < 0)

            if (newEstates.length > 0) {
                this.log('`- ' + newEstates.length + ' new estates')
                for (let e of newEstates) {
                    await this.sendNotif(this.extractTitleFromEstate(e), `Prix: ${this.extractPriceFromEstate(e)}€\nSurface: ${this.extractSquareFromEstate(e)}m²\nZone: ${this.extractZoneFromEstate(e)}${this.extractBodyMessageFromEstate(e)}`, this.extractUrlFromEstate(e));
                    this.data.seen.push(this.extractIdFromEstate(e));
                    this.log(`  \`- id : ${this.extractIdFromEstate(e)}`)
                }

                fs.writeFileSync(this.dataFile, JSON.stringify(this.data, null, 2));
            } else
                this.log('`- no new estate');
        }
        catch(e) {
            this.log(`Error: ${e}`);
        }
    }

    sendNotif(subject, body, url) {
        return Sms.sendSMS(`[${this.name}]\n${subject}\n${body}\n${url}`)
    }

    extractIdFromEstate(e) {
    }

    extractTitleFromEstate(e) {
    }

    extractPriceFromEstate(e) {
    }

    extractSquareFromEstate(e) {
    }

    extractZoneFromEstate(e) {
    }

    extractBodyMessageFromEstate(e) {
        return '';
    }

    extractUrlFromEstate(e) {
    }

    addHeaders() {
        return {};
    }

    async transformResults(r) {
        return r;
    }

    async doRequest() {
        return this.transformResults(
            this.isPost ?
                await R({
                    method: 'POST',
                    uri: this.apiUrl,
                    body: this.filters,
                    headers: this.addHeaders(),
                    json: this.json,
                    gzip: true
                }) :
                await R({
                    uri: this.apiUrl,
                    qs: this.filters,
                    headers: this.addHeaders(),
                    json: this.json,
                    strictSSL: false
                })
        );
    }

    toggle() {
        this.started = !this.started;
        return `Service [${this.name}] is now ${this.started ? 'started' : 'stopped'} !`
    }

    async clear() {
        const estates = await this.doRequest();
        const before = this.data.seen.length;
        this.data.seen = this.data.seen.filter(id => estates.map(this.extractIdFromEstate).indexOf(id) >= 0);

        return `${before - this.data.seen.length} IDs cleared`;
    }

    log(msg) {
        console.log(this.logPrefix + msg)
    }
}
