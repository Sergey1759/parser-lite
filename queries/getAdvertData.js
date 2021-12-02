const axios = require('axios');
const { parse } = require("node-html-parser");
async function  getWithoutParserDataAdvert(url){
    return axios.get(url)
        .then(response => {
            let html = parse(response.data);

            const header = html.querySelector('h1[data-cy="ad_title"]').innerText;
            const price = html.querySelector('div[data-testid="ad-price-container"] h3').innerText;
            const description = html.querySelector('div[data-cy="ad_description"] div').innerText;
            const images = [...html.querySelectorAll('.css-158jbzd img')].map(el => {
                let src = el.rawAttributes.src || el.rawAttributes['data-src'];
                // console.log(el.rawAttributes);
                return src.split(';')[0];
            });
            images.pop();
            let id = html.querySelector('div[data-cy="ad-footer-bar-section"] span').innerText;
            id = id.split(':')[1].trim();
            const obj =  {header, price, description, id, images};
            console.log(obj);
            return obj;
        })
        .catch(err => {
            console.log('wwwwwwwwwwwwwwwwwwwwww');
            console.log(err)
        })
}
module.exports = {getWithoutParserDataAdvert}