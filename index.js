const express = require('express');

const app = express();

app.use('/gaf', (req, res) => {
  console.log(req);
  res.json({
    "response_type": "in_channel",
    "text": "It's 80 degrees right now.",
    "attachments": [
        {
            "text":"Partly cloudy today and tomorrow"
        }
    ]
});
});

app.listen(8889, () => {
  console.log('listening');
});
