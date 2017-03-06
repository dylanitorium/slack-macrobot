const express = require('express');
const http = require('http');
const concat = require('concat-stream');

const APP_ID = process.env.APP_ID
const BASE = '/v1_1/search/';
const FIELDS = [
  'item_name',
  'item_id',
  'brand_name',
  'nf_calories',
  'nf_total_fat',
  'nf_protein',
  'nf_total_carbohydrate',
  'nf_serving_size_qty',
  'nf_serving_size_unit',
  'nf_serving_weight_grams'
];

const app = express();

const buildQuery = (query, fields) => (encodeURI(`${query}?fields=${fields.join(',')}`));

const getPath = (query, base, fields, appId) => (
  base + buildQuery(query.trim(), fields) + `&appId=${appId}`
);

const indexHandler = (req, res) => {
  const {
    query: {
      text
    }
  } = req;

  if (!text) return res.sendStatus(400);

  http.get({
    host: 'api.nutritionix.com',
    path: getPath(text, BASE, FIELDS, APP_ID),
  }, (getRes) => {
    getRes.on('error', (err) => {
      console.log(error);
    })
    getRes.pipe(concat((buf) => {
      var hits = JSON.parse(buf.toString()).hits;
      if (!hits.length) {
        return res.json({
          "response_type": "ephemeral",
          "text": 'Couldn\'t find whatever weird thing you search for.',
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
                "title": "Serving size",
                "value": `${data.nf_serving_size_qty}${data.nf_serving_size_unit} / ${data.nf_serving_weight_grams}g`,
                "short": false
              },
              {
                "title": "Calories",
                "value": data.nf_calories,
                "short": true
              },
              {
                "title": "Protein (g)",
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
}

app.use('/', indexHander);
app.listen(8889, () => {
  console.log('listening');
});
