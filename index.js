const express = require('express');
const http = require('http');
const concat = require('concat-stream')
const cheerio = require('cheerio')

const options = {
  host: 'www.neogaf.com',
  path: '/forum/showthread.php?t='
};

const app = express();

app.use('/macros', (req, res) => {
  const item = req.query.text.trim();

  const fields = [
    'item_name',
    'item_id',
    'brand_name',
    'nf_calories',
    'nf_total_fat',
    'nf_protein',
    'nf_total_carbohydrate'
  ];

  var path = '/v1_1/search/';
  path += encodeURI(`${item}?fields=${fields.join(',')}`);
  path += '&appId=38256e6d&appKey=66431bb4bbec110e138f0a677cad31f3';

  http.get({
    host: 'api.nutritionix.com',
    path: path,
  }, (getRes) => {
    getRes.on('error', (err) => {
      console.log(error);
    })
    getRes.pipe(concat((buf) => {
      var data = JSON.parse(buf.toString()).hits[0].fields;
      var message = `${data.item_name}(${data.brand_name})`;
      message += ` - ${data.nf_calories}cal / ${data.nf_protein}g (protein) /`
      message += ` ${data.nf_total_carbohydrate}g (carbs) / ${data.nf_total_fat}g (fat)`;

      res.json({
        "response_type": "in_channel",
        "text": message,
      });
    }));
  });
});
app.listen(8889, () => {
  console.log('listening');
});
