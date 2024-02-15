const http = require('http');
const url = require('url');
const query = require('querystring');
const clientHandler = require('./clientResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];
  request.on('error', (err) => {
    console.log(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    parseBody(request, response, jsonHandler.addUser);
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    clientHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getUsers') {
    parseBody(request, response, jsonHandler.getUsers);
  } else if (parsedUrl.pathname === '/') {
    clientHandler.getIndex(request, response);
  } else {
    parseBody(request, response, jsonHandler.notFound);
  }
};

const onRequest = (request, response) => {
  console.log(request.url);
  const parsedUrl = url.parse(request.url);
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }

  // not found code
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on port: 127.0.0.1:${port}`);
});
