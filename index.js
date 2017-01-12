const express = require('express');

const app = express();

app.post('/gaf', (req, res) => {
  console.log(req);
  res.send('hello');
});

app.listen(8889, () => {
  console.log('listening');
});
