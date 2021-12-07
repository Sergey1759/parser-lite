const express = require('express');
const router = express.Router();
const {getAdvert} = require('../module/parserGetAdvert');
const {getAuthToken} = require('../module/getAuthToken');
const {replaceNumber} = require('../helpers/replaceNumber');
const {getUserNumber} = require('../queries/query');
const {getLinksByPageUrl} = require('../queries/getLinksByPageUrl');
const {getWithoutParserDataAdvert} = require('../queries/getAdvertData');
const apiUsers = require('../api/UsersOlx');
const mongoose = require("mongoose");
const {Token} = require('../class/Token');
mongoose.connect(`mongodb+srv://sergey:CBV4uXIKf39byH8K@cluster0.r6wfp.mongodb.net/olx?retryWrites=true`,{ useNewUrlParser: true, useUnifiedTopology: true } );

const takeNumber = false

let token = new Token();



/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getAdvert', async function(req, res, next) {
  let url = req.query.url || 'https://www.olx.ua/nedvizhimost/kvartiry/vinnitsa/';
  console.log(req.query);
  // return
  //if (!url.includes('https://www.olx.ua/')) url = 'https://www.olx.ua/' + url;
  let countAdvert =  req.query.countAdvert || 2 ;
  countAdvert = Number.parseInt(countAdvert);
  console.log(countAdvert);
  // return
  let links = await getLinksByPageUrl(url);
 // links.splice(0,4); // видаляти перші 4
  console.log(links);

  if (takeNumber && !token.isInit) await token.init();

  let arrayResponse = [];
  let i = 0;
  while (arrayResponse.length < countAdvert && i < 5){
    console.log(arrayResponse.length <= countAdvert)
    console.log(arrayResponse.length <= i)
    try{
      let response = await getWithoutParserDataAdvert(links[i++]);

      if (takeNumber) {
        let numberPhone = await getUserNumber(response.id, await token.getToken());
        numberPhone = replaceNumber(numberPhone);
        response.number = numberPhone;
      }

      arrayResponse.push(response);

    } catch (e) {
      console.log(e);
    }
  }


  res.send(arrayResponse);
});





module.exports = router;
