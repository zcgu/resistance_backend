var express = require('express');
var bodyParser = require('body-parser');
var url = require('./url');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var createuser = function(req, res, next) {
  global.userid += 1;

  const userid = global.userid - 1;
  global.users[userid] = {};

  console.log('global.users:', global.users);

  res.json({userid: userid});
}

var createroom = function(req, res, next) {
  const userid = req.body.userid;

  if (!userid) {
    console.log("Don't get userid in createroom request body.");
    res.status(500).json({roomid: 0});
    return;
  }

  global.roomid += 1;

  const roomid = global.roomid - 1;
  global.rooms[roomid] = {};
  global.rooms[roomid].users = [userid];

  console.log('globale.rooms:', global.rooms);

  res.json({roomid: roomid});
}

var joinroom = function(req, res, next) {
  const userid = req.body.userid;
  const roomid = req.body.roomid;

  if (!userid || !roomid) {
    console.log("Don't get userid/roomid in joinroom request body.");
    res.status(500).send('0');
    return;
  }

  if (global.rooms[roomid].users.length == 5) {
    res.status(500).send('Room is full.');
    return;
  }

  global.rooms[roomid].users.push(userid);

  console.log('globale.rooms:', global.rooms);

  res.send('1');
}

var changename = function(req, res, next) {
  const userid = req.body.userid;
  const name = req.body.name;

  if (!userid || !name) {
    console.log("Don't get userid/name in changename request body.");
    res.status(500).send('0');
    return;
  }

  global.users[userid].name = name;

  console.log('global.user:', global.users);
  res.send('1');
}

app.post('/', createuser);
app.post(url.createroom, createroom)
app.post(url.joinroom, joinroom)
app.post(url.changename, changename)

module.exports = app;