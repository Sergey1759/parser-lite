const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

async function getAuthToken(login, password) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=egl'],
        // headless : false 
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});
    await clearBrowser ();

    const recorder = new PuppeteerScreenRecorder(page);
    await recorder.start(`./report/video/simple${new Date().getUTCDate()}.mp4`);

    await page.goto('https://www.olx.ua/uk/account/',{
        waitUntil: 'load',
        timeout: 50000
    });

    await clearBrowser ();


    await page.type('#userEmail', login, {delay: 120});
    await page.type('#userPass', password, {delay: 120});
    await page.click('button#se_userLogin');
    

    try {
        await page.waitForNavigation({waitUntil: 'load'});
        await page.screenshot({path: `screenshots/screenshot${new Date().getTime()}.png`});
    } catch (e){
        // console.log(e);
        // if (e.includes('TimeoutError:')) console.log('TimeoutError change proxy')
        let html = await page.evaluate( async function () {
            await new Promise(resolve => setTimeout(resolve, 2000));
            let cookies = document.body.innerHTML;
            return cookies;
        });
        await page.screenshot({path: `screenshots/screenshot${new Date().getTime()}.png`});
        await recorder.stop();
        let pages = await browser.pages(); await Promise.all(pages.map(page =>page.close())); await browser.close();
        await browser.close();
        console.log(e);
        throw new Error('Navigation timeout change IP' + html);
    }

    let token;
    try{
        await page.screenshot({path: `screenshots/screenshot${new Date().getTime()}.png`});
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
        await recorder.stop();
        await page.screenshot({path: `screenshots/screenshot${new Date().getTime()}.png`});
        let pages = await browser.pages(); await Promise.all(pages.map(page =>page.close())); await browser.close();
        await browser.close();
        throw new Error('Change IP' + html);
    }
    

    await page.screenshot({path: `screenshots/screenshot${new Date().getTime()}.png`});

    await recorder.stop();
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
