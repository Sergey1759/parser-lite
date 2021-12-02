const axios = require('axios');
const { parse } = require("node-html-parser");
async function  getLinksByPageUrl(url){
    return axios.get(url)
        .then(response => {
            let html = parse(response.data);
            let divElements = html.querySelectorAll('.marginright5.link.linkWithHash.detailsLink');
            let urls = [];
            for (const element of divElements) { urls.push(element._attrs.href) }
            return urls;
        })
        .catch(err => {
            console.log('wwwwwwwwwwwwwwwwwwwwww');
            console.log(err)
        })
}
module.exports = {getLinksByPageUrl}