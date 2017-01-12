const express = require('express');
const http = require('http');
const bl = require('bl');
const options = {
  host: 'www.neogaf.com',
  path: '/forum/showthread.php?t='
};

const app = express();

app.use('/gaf', (req, res) => {
  const id = req.params.text.trim();
  options.path += id;
  http.get(options, (getRes) => {
    console.log(getRes);
    getRes.pipe(bl((err, data) => {
      res.json({
        "response_type": "in_channel",
        "text": id
      });
    }));
  });
});
app.listen(8889, () => {
  console.log('listening');
});
