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

  var path = '/v1_1/search/';
  path += encodeURI(item);
  path += '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat%2Cnf_protein';
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
      res.json({
        "response_type": "in_channel",
        "text": `${data.item_name}(${data.brand_name}) ${data.nf_calories}(cal) ${data.nf_protein}g (protein) ${data.nf_total_fat}g(total fat)`
      });
    }));
  });
});
app.listen(8889, () => {
  console.log('listening');
});
