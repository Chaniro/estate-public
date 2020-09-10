const Site = require('./_Site')
const Settings = require('../../settings')
const c = require('chalk');

class BienIci extends Site {

    constructor() {
        super('BienIci', 'https://www.bienici.com/realEstateAds.json', false, {
            filters: JSON.stringify({
                "size": 24,
                "from": 0,
                "filterType": "buy",
                "propertyType": ["house", "flat"],
                "minPrice": Settings.cost.min,
                "maxPrice": Settings.cost.max,
                "minRooms": 3,
                "minArea": Settings.minSize,
                "newProperty": false,
                "page": 1,
                "resultsPerPage": 24,
                "maxAuthorizedResults": 2400,
                "sortBy": "relevance",
                "sortOrder": "desc",
                "onTheMarket": [true],
                "mapMode": "enabled",
                "limit": "ue}dHp{qJ?_{oAt{QnC?~qoA",
                "showAllModels": false,
                "blurInfoType": ["disk", "exact"],
                "zoneIdsByTypes": {"zoneIds": ["-54517"]}
            })
        }, true);

        this.logPrefix = c.blue(`[ ${this.name} ] `);
    }


    async transformResults(r) {
        return r.realEstateAds;
    }

    extractIdFromEstate(e) {
        return e.id;
    }

    extractTitleFromEstate(e) {
        return e.title;
    }

    extractPriceFromEstate(e) {
        return e.price
    }

    extractSquareFromEstate(e) {
        return e.surfaceArea;
    }

    extractZoneFromEstate(e) {
        return e.district.name;
    }

    extractUrlFromEstate(e) {
        return `https://www.bienici.com/annonce/${e.id}`
    }
}

module.exports = new BienIci();
