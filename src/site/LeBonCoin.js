const Site = require('./_Site')
const Settings = require('../../settings')

class LeBonCoin extends Site {

    constructor() {
        super('LeBonCoin', 'https://api.leboncoin.fr/finder/search', true, {
            filters: {
                category: {id: "9"},
                enums: {ad_type: ["offer"], real_estate_type: ["2"]},
                keywords: {text: "rennes"},
                location: {
                    locations: [{
                        "locationType": "city",
                        label: "Rennes (toute la ville)",
                        city: "Rennes",
                        department_id: "35",
                        region_id: "6",
                        area: {lat: 48.10717427604917, lng: -1.6693251892374632, default_radius: 10000}
                    }]
                },
                ranges: {price: {min: Settings.cost.min, max: Settings.cost.max}, square: {min: Settings.minSize}}
            }, limit: 35, limit_alu: 3
        }, true);
    }


    async transformResults(r) {
        return r.ads;
    }

    extractIdFromEstate(e) {
        return e.list_id;
    }

    extractTitleFromEstate(e) {
        return e.subject
    }

    extractPriceFromEstate(e) {
        return e.price[0];
    }

    extractSquareFromEstate(e) {
        return e.attributes.find(a => a.key === 'square').value;
    }

    extractZoneFromEstate(e) {
        return 'inconnue';
    }

    extractUrlFromEstate(e) {
        return e.url;
    }


    addHeaders() {
        return {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9,fr;q=0.8",
            "api_key": "ba0c2dad52b3ec",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            "Host": "api.leboncoin.fr",
            "Origin": "https://www.leboncoin.fr",
            "Pragma": "no-cache",
            "Referer": "https://www.leboncoin.fr/recherche/?category=9&text=rennes&locations=Rennes__48.10717427604917_-1.6693251892374632_10000&real_estate_type=2&price=100000-275000&square=70-max",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
        }
    }
}

module.exports = new LeBonCoin();
