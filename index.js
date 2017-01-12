const express = require('express');

const app = express();

app.use('/gaf', (req, res) => {
  console.log(req);
  res.send('hello');
});

app.listen(8889, () => {
  console.log('listening');
});
