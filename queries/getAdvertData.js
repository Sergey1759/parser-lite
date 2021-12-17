const axios = require('axios');
const { parse } = require("node-html-parser");
async function  getWithoutParserDataAdvert(url){
    return axios.get(url)
        .then(response => {
            let html = parse(response.data);

            let str = html.toString();
            let location = '{' + str.split('"location\\":{')[1].split('}')[0] + '}';
            location = location.split(/\\/gm).join('');
            location = JSON.parse(location)

            let city = location['cityName']

            const acc_created = html.querySelector('div[class="css-1bafgv4-Text eu5v0x0"]').innerText;
            const created = html.querySelector('span[data-cy="ad-posted-at"]').innerText;

            const header = html.querySelector('h1[data-cy="ad_title"]').innerText;
            const price = html.querySelector('div[data-testid="ad-price-container"] h3').innerText;
            const description = html.querySelector('div[data-cy="ad_description"] div').innerText;
            const images = [...html.querySelectorAll('.css-158jbzd img')].map(el => {
                let src = el.rawAttributes.src || el.rawAttributes['data-src'];
                return src.split(';')[0];
            });
            images.pop();
            let id = html.querySelector('div[data-cy="ad-footer-bar-section"] span').innerText;
            id = id.split(':')[1].trim();
            const obj =  {
                url, acc_created, created, city,
                header, price, description, id, images
            };
            return obj;
        })
        .catch(err => {
            console.log(err)
        })
}
module.exports = {getWithoutParserDataAdvert}