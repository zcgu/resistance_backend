global.host = 'localhost';
global.port = 5000;

global.userid = 1;
global.users = {};  //{name:}

/**
 * global.rooms:
 * {
 *  roomid: {
 *    users: [userid]
 *    
 *  }
 * }
 */
global.roomid = 1;
global.rooms = {};  


var http = require('http');
var app = require('./app');
http.createServer(app).listen(global.port, global.host);
console.log('Server running at http://' + global.host + ':' + global.port);