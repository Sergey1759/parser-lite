const puppeteer = require('puppeteer');
const UserAgent = require("user-agents");

async function getAdvert(urlAdvert) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // headless : false
    });

    const page = await browser.newPage();
    await clearBrowser ();
    await page.setViewport({ width: 1920, height: 1800 });
    let userAgent = new UserAgent();
    userAgent = userAgent.toString();
    await page.setUserAgent(userAgent);

    await clearBrowser ();
    await page.goto(urlAdvert,{
        waitUntil: 'load',
        timeout: 0
    });

    await page.setDefaultNavigationTimeout(0);


    let data  = await page.evaluate(async ()=>{
        // await new Promise(resolve => setTimeout(resolve, 3000));

        const header = document.querySelector('h1[data-cy="ad_title"]').innerText;
        const price = document.querySelector('div[data-testid="ad-price-container"]').innerText;
        const description = document.querySelector('div[data-cy="ad_description"] div').innerText;
        const images = [...document.querySelectorAll('.css-158jbzd img')].map(el => {
            let src = el.src || el.dataset.src;
            return src.split(';')[0];
        });
        images.pop();
        let id = document.querySelector('div[data-cy="ad-footer-bar-section"] span').innerText;
        id = id.split(':')[1].trim();
        const obj =  {header, price, description, images, id};
        console.log(obj);
        return obj;
    });
    // await new Promise(resolve => setTimeout(resolve, 30000));

    console.log(data);
    await clearBrowser ();

    let pages = await browser.pages(); await Promise.all(pages.map(page =>page.close())); await browser.close();
    await browser.close();

    async function clearBrowser (){
        // clear cookies
        const client = await page.target().createCDPSession()
        await client.send('Network.clearBrowserCookies')
    }

    return data;


}
module.exports = {getAdvert};
