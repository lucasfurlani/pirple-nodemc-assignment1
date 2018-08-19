// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Instantiate the http server
let httpServer = http.createServer(function(req, res){
    // Get the parsed url
    let parsedUrl = url.parse(req.url, true);

    // Get the path from the url
    let path = parsedUrl.pathname;

    // Remove trailig slashes
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get query string as an object
    let queryStringObject = parsedUrl.query;

    // Get the method
    let method = req.method.toLowerCase();
    
    // Choose the handler this request should go to. If one is not found, use not found handler
    let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;        

    // Construct the data object to send to the handler
    let data = {
        'trimmedPath': trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
    }

    // Route the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload){
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        payload = typeof(payload) == 'object' ? payload : {};
        // Convert payload to string
        let payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);

        // Log the request
        console.log('Request made to path ' + trimmedPath + ' with method '+method);

        // Log the response
        console.log('Returning this response ', statusCode, payloadString);
    });
});

httpServer.listen(3000, function() {
    console.log("Server listening on port 3000.");
});

// Define handlers
let handlers = {};

// Hello handler
handlers.hello = function(data, callback) {
    if (data.method === 'post'){
        callback(200, {'message' : 'Hello there!'});
    } else {
        callback(405);
    }
};

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404)
}

// Define a request router
let router = {
    'hello' : handlers.hello
};