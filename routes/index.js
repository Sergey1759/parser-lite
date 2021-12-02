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

let token = new Token();



/* GET home page. */
router.get('/', async function(req, res, next) {
  let m = await getWithoutParserDataAdvert('https://www.olx.ua/d/obyavlenie/1-k-kvartira-zhk-semeynyy-komfort-44-m2-IDHkG9B.html#6ec24dd30d');
  console.log(m);
  res.render('index', { title: 'Express' });
});

router.get('/getAdvert', async function(req, res, next) {
  let params = req.body;
  let countAdvert = 2;
  let links = await getLinksByPageUrl('https://www.olx.ua/nedvizhimost/kvartiry/vinnitsa/');
  links.splice(0,8);
  console.log(links);

  if(!token.isInit) await token.init();

  let arrayResponse = [];
  let i = 0;
  while (arrayResponse.length < countAdvert){
    try{
      let response = await getWithoutParserDataAdvert(links[i++]);
      let numberPhone = await getUserNumber(response.id,await token.getToken());
      numberPhone = replaceNumber(numberPhone);
      response.number = numberPhone;
      arrayResponse.push(response);
    } catch (e) {
      console.log(e);
    }
  }


  res.send(arrayResponse);
});





module.exports = router;
