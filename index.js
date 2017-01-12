const express = require('express');
const http = require('http');
const bl = require('bl');
const options = {
  host: 'www.neogaf.com',
  path: '/forum/showthread.php?t='
};

const app = express();

app.use('/gaf', (req, res) => {
  console.log(req);
  const id = req.query.text.trim();
  options.path += id;
  http.get(options, (getRes) => {
    getRes.pipe(bl((err, data) => {
      res.json({
        "response_type": "in_channel",
        "text": data.toString();
      });
    }));
  });
});
app.listen(8889, () => {
  console.log('listening');
});
