const express = require('express');
const http = require('http');
const concat = require('concat-stream')

const options = {
  host: 'www.neogaf.com',
  path: '/forum/showthread.php?t='
};

const app = express();

app.use('/macros', (req, res) => {
  if (!req.query.text) return res.sendStatus(400);
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
  const base = '/v1_1/search/';
  var path = base + encodeURI(`${item}?fields=${fields.join(',')}`);
  path += '&appId=38256e6d&appKey=66431bb4bbec110e138f0a677cad31f3';

  http.get({
    host: 'api.nutritionix.com',
    path: path,
  }, (getRes) => {
    getRes.on('error', (err) => {
      console.log(error);
    })
    getRes.pipe(concat((buf) => {
      var hits = JSON.parse(buf.toString()).hits;
      if (!hits.length) {
        return res.json({
          "response_type": "ephemeral",
          "text": 'Couldn\'t find whatever weird thing you search for. You fucking weirdo',
        });
      }
      var data = hits[0].fields;
      return res.json({
        "response_type": "in_channel",
        "text": `${data.item_name} - ${data.brand_name}`,
        "attachments": [
          {
            "fields": [
              {
                "title": "Calories",
                "value": data.nf_calories,
                "short": true
              },
              {
                "title": "Protein (g) (you fucking happy mark?)",
                "value": data.nf_protein,
                "short": true
              },
              {
                "title": "Carbs (g)",
                "value": data.nf_total_carbohydrate,
                "short": true
              },
              {
                "title": "Fat (g)",
                "value": data.nf_total_fat,
                "short": true
              }
            ],
            "color": "#ffcc66"
          }
        ]
      });
    }));
  });
});
app.listen(8889, () => {
  console.log('listening');
});
