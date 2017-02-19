global.host = 'localhost';
global.port = 5000;

global.userid = 1;
global.users = {};  //{name:}

/**
 * global.rooms:
 * {
 *  roomid: {
 *    users: [userid]
 *    start: 1 - not, 2 - started
 *    goodpeople: [userid]
 *    badpeople: [userid]
 *    caption: userid
 *    
 *    turn: 1-5
 *    failtime: 0-3
 *    candidate: [userid]
 *    speech: userid
 *    disagreetimes: 0 - 3
 *    agree: [userid]
 *    disagree: [userid]
 * 
 *    success: [userid]
 *    fail: [userid]
 *  }
 * }
 */
global.roomid = 1;
global.rooms = {};  

var app = require('./app');
app.listen(global.port || 8080, function() {
  console.log("Node app is running at localhost:" + (global.port || 8080))
})