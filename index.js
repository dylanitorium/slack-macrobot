const express = require('express');
const http = require('http');
const concat = require('concat-stream')
const cheerio = require('cheerio')

const options = {
  host: 'www.neogaf.com',
  path: '/forum/showthread.php?t='
};

const app = express();

app.use('/gaf', (req, res) => {
  const id = req.query.text.trim();
  options.path += id;

  http.get(options, (getRes) => {
    getRes.on('error', (err) => {
      console.log(error);
    })
    getRes.pipe(concat((data) => {
      const $ = cheerio.load(data.toString())
      res.json({
        "response_type": "in_channel",
        "text": $('title').text(),
      });
    }));
  });
});
app.listen(8889, () => {
  console.log('listening');
});
