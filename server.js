const express = require('express');

const server = express();

server.use( express.static('assets') )

server.get('/', (request, response) => {
  response.sendFile('/home/ideans/Documents/dev/projects/alfred/index.html');
})

server.listen(4000, () => console.log('Server listening.'))