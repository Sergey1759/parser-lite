const axios = require('axios');
const { parse } = require("node-html-parser");
async function  getWithoutParserDataAdvert(url){
    return axios.get(url)
        .then(response => {
            let html = parse(response.data);

            const acc_created = html.querySelector('div[class="css-1bafgv4-Text eu5v0x0"]').innerText;
            const posted = html.querySelector('span[data-cy="ad-posted-at"]').innerText;
            // const city0 = html.querySelector('div#root div[class="css-50cyfj"] div[class="css-eovh6h"] div[class="css-1d90tha"] div[class="css-eahd7t"] div[class="css-1wws9er"] div[class="css-1q7h1ph"] section[class="css-1tgtvwl"] div[class="css-1nrl4q4"] div p[class="css-7xdcwc-Text eu5v0x0"]');

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
                url, acc_created, posted,
                header, price, description, id, images
            };
            // console.log(obj);
            return obj;
        })
        .catch(err => {
           // console.log('wwwwwwwwwwwwwwwwwwwwww');
            console.log(err)
        })
}
module.exports = {getWithoutParserDataAdvert}