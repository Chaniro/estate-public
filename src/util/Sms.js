const request = require('request')

const endpoint = 'https://smsapi.free-mobile.fr/sendmsg';
const apiKey = 'XXX';
const userID = 'XXX';

class Sms {
    sendSMS(message) {
        return new Promise((ok, ko) => {
            if (process.env.DEBUG) {
                console.log('SMS: ' + message);
                ok();
            } else {
                let url = endpoint + '?user=' + userID + '&pass=' + apiKey + '&msg=' + encodeURIComponent(message);

                request(url, function (err, response) {
                    if (err)
                        ko(err);
                    else
                        ok(response);
                })
            }
        });
    }
}

module.exports = new Sms();
