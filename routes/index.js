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
// const {Token} = require('../class/Token');
const {Token} = require('../class/Tokens');

mongoose.connect(`mongodb+srv://sergey:JobKWa7wKmDl09OZ@cluster0.r6wfp.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true } ).catch(err => {
  console.log(err);
});

let token = new Token();


router.get('/', async function(req, res, next) {
  let tokens = await token.createToken();
  res.render('index', { title: 'Express' , result2: JSON.stringify(tokens)});
});

router.get('/getAdvert', async function(req, res, next) {
  let url = req.query.url || 'https://www.olx.ua/nedvizhimost/kvartiry/vinnitsa/';
  console.log(req.query);
  if (!url.includes('https://')) url = 'https://' + url;

  let countAdvert =  req.query.countAdvert || 2 ;
  countAdvert = Number.parseInt(countAdvert);

  let links = await getLinksByPageUrl(url);

  links.splice(0,8);
  console.log(links);


  let arrayResponse = [];
  let i = 0;
  await token.createToken();
  let array_tokens = token.getListTokens();
  console.log(array_tokens);
  while (arrayResponse.length < countAdvert && i < 2){
    // console.log(arrayResponse.length <= countAdvert)
    // console.log(arrayResponse.length <= i)
    try{
      let response = await getWithoutParserDataAdvert(links[i++]);
      let numberPhone = await getUserNumber(response.id, array_tokens[0].token);
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
