const Site = require('./_Site')
const Settings = require('../../settings')
const cheerio = require('cheerio')

class OuestImmo extends Site {

    constructor() {
        super('OuestImmo',
            `https://www.ouestfrance-immo.com/acheter/appartement/rennes-35-35000/`,
            false,
            {
                prix: `${Settings.cost.min}_${Settings.cost.max}`,
                surface: `${Settings.minSize}_0`
            },
            false);
    }

    async transformResults(html) {
        const $ = cheerio.load(html);
        const data = [];

        $('#listAnnonces > a').each((i, el) => {
            el = $(el);
            data.push({
                id: $(el.children('div[data-id]').get(0)).attr('data-id'),
                title: el.attr('title'),
                price: $(el.find('.annPrix').get(0)).text().replace('€', '').replace(/\s*/gi, ''),
                //79m² | 3 chb | 1 sdb
                square: $(el.find('.annCriteres').get(0)).text()
                    .trim()
                    .split('|')[0].trim()
                    .replace('m²', ''),
                zone: $(el.find('.annVille').get(0)).text(),
                url: 'https://www.ouestfrance-immo.com' + el.attr('href')
            })
        })

        return data;
    }

    extractIdFromEstate(e) {
        return e.id;
    }

    extractTitleFromEstate(e) {
        return e.title;
    }

    extractPriceFromEstate(e) {
        return e.price;
    }

    extractSquareFromEstate(e) {
        return e.square;
    }

    extractZoneFromEstate(e) {
        return e.zone;
    }


    extractUrlFromEstate(e) {
        return e.url;
    }
}

module.exports = new OuestImmo();
