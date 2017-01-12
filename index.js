var http = require('http');
var fs = require('fs');


http.createServer(function (req, res) {
  console.log(req);
}).listen(8889);
