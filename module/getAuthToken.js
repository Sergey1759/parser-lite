const puppeteer = require('puppeteer');

async function getAuthToken(login, password) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=egl'],
        // headless : false 
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});
    await clearBrowser ();


    await page.goto('https://www.olx.ua/uk/account/',{
        waitUntil: 'load',
        timeout: 30000
    });

    await clearBrowser ();


    await page.type('#userEmail', login, {delay: 120});
    await page.type('#userPass', password, {delay: 120});
    await page.click('button#se_userLogin');


    try {
        await page.waitForNavigation({waitUntil: 'load'});
    } catch (e){
        // console.log(e);
        // if (e.includes('TimeoutError:')) console.log('TimeoutError change proxy')
        console.log(e);
        throw error(`Navigation timeout change IP`);
    }

    let token;
    try{
        token = await page.evaluate( async function () {
            await new Promise(resolve => setTimeout(resolve, 5000));
            let cookies = `${document.cookie}`.split('access_token')[1].split(';')[0].replace('=','');
            return cookies;
        });
    } catch(e){
        let html = await page.evaluate( async function () {
            await new Promise(resolve => setTimeout(resolve, 2000));
            let cookies = document.body.innerHTML;
            return cookies;
        });
        let pages = await browser.pages(); await Promise.all(pages.map(page =>page.close())); await browser.close();
        await browser.close();
        throw new Error('Change IP' + html);
    }
    



    let pages = await browser.pages(); await Promise.all(pages.map(page =>page.close())); await browser.close();
    await browser.close();

    async function clearBrowser (){
        // clear cookies
        const client = await page.target().createCDPSession()
        await client.send('Network.clearBrowserCookies')
    }

    return token;
}
module.exports = {getAuthToken};
