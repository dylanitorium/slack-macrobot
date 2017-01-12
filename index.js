const express = require('express');
const https = require('https');
const concat = require('concat-stream')
const cheerio = require('cheerio')

const options = {
  host: 'www.neogaf.com',
  path: '/forum/showthread.php?t='
};

const app = express();

// app.use('/gaf', (req, res) => {
//   const id = req.query.text.trim();
//   http.get({
//     host: 'www.neogaf.com',
//     path: `/forum/showthread.php?t=${id}`,
//   }, (getRes) => {
//     getRes.on('error', (err) => {
//       console.log(error);
//     })
//     getRes.pipe(concat((data) => {
//       const $ = cheerio.load(data.toString())
//       res.json({
//         "response_type": "in_channel",
//         "text": $('title').text(),
//       });
//     }));
//   });
// });
app.use('/macros', (req, res) => {
  const item = req.query.text.trim();

  var path = 'v1_1/search/';
  path += encodeURI(item);
  path += '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat';
  path += '&appId=38256e6d&appKey=66431bb4bbec110e138f0a677cad31f3';

  https.get({
    host: 'api.nutritionix.com/',
    path: path,
  }, (getRes) => {
    getRes.on('error', (err) => {
      console.log(error);
    })
    getRes.pipe(concat((data) => {
      var data = data.toString();
      data = data.hits[0].fields;
      res.json({
        "response_type": "in_channel",
        "text": `${data.item_name}(${data.brand_name}) ${data.nf_calories}(cal) ${data.nf_total_fat}g(total fat)`
      });
    }));
  });
});
app.listen(8889, () => {
  console.log('listening');
});
