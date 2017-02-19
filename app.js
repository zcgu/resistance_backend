var express = require('express');
var bodyParser = require('body-parser');
var url = require('./url');
var helper = require('./helper');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var createuser = function(req, res, next) {
  global.userid += 1;

  const userid = global.userid - 1;
  global.users[userid] = {name: 'User ' + userid};

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

  const room = global.rooms[roomid];
  room.users = [userid];
  room.start = 1;

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

  const room = global.rooms[roomid];

  if (room.users.length == 5) {
    res.status(500).send('Room is full.');
    return;
  }

  room.users.push(userid);

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

var start = function(req, res, next) {
  const roomid = req.body.roomid;
  
  if (!roomid) {
    console.log("Don't get roomid in start request body.");
    res.status(500).send('0');
    return;
  }

  const room = global.rooms[roomid];
  room.start = 2;
  var tmp = room.users.slice();
  helper.shuffle(tmp);
  room.goodpeople = tmp.slice(0, 3);
  room.badpeople = tmp.slice(3, 5);
  room.goodpeople.sort();
  room.badpeople.sort();
  room.caption = room.users[0];
  room.turn = 1;
  room.failtime = 0;
  room.candidate = [];
  room.speech = room.caption;
  room.disagreetimes = 0;
  room.agree = [];
  room.disagree = [];
  room.fail = [];
  room.success = [];

  console.log('room:', room);
  res.send('1');
}

var setcandidate = function(req, res, next) {
  var userids = req.body.userids;
  const roomid = req.body.roomid;

  if (!userids || !roomid) {
    console.log("Don't get userids/roomid in set candidate request body.");
    res.status(500).send('0');
    return;
  }

  userids = JSON.parse(userids);

  const room = global.rooms[roomid];
  room.candidate = userids;

  console.log('room:', room, global.users[userids[0]]);

  res.send('1');
}

var finishspeech = function(req, res, next) {
  const userid = req.body.userid;
  const roomid = req.body.roomid;

  if (!userid || !roomid) {
    console.log("Don't get userid/roomid in finish request body.");
    res.status(500).send('0');
    return;
  }

  const room = global.rooms[roomid];
  const index = room.users.indexOf(userid);
  room.speech = room.users[(index + 1) % room.users.length];

  console.log('room:', room);

  res.send('1');
}

var vote = function(req, res, next) {
  const userid = req.body.userid;
  const roomid = req.body.roomid;
  const agree = req.body.agree;

  if (!userid || !roomid || !agree) {
    console.log("Don't get userid/roomid/agree in vote request body.");
    res.status(500).send('0');
    return;
  }

  const room = global.rooms[roomid];
  if (agree == 0) {
    room.disagree.push(userid);
  } else {
    room.agree.push(userid);
  }

  console.log('room:', room);
  res.send('1');
}

var mission = function(req, res, next) {
  const userid = req.body.userid;
  const roomid = req.body.roomid;
  const success = req.body.success;

  if (!userid || !roomid || !success) {
    console.log("Don't get userid/roomid/success in vote request body.");
    res.status(500).send('0');
    return;
  }

  const room = global.rooms[roomid];
  if (success == 0) {
    room.fail.push(userid);
  } else {
    room.success.push(userid);
  }

  console.log('room:', room);
  res.send('1');
}

var check = function(req, res, next) {
  const roomid = req.body.roomid;

  if (!roomid) {
    console.log("Don't get userid/roomid/success in vote request body.");
    res.status(500).send('0');
    return;
  }

  const room = global.rooms[roomid];
  res.json(room);
}

app.post('/', createuser);
app.post(url.createroom, createroom);
app.post(url.joinroom, joinroom);
app.post(url.changename, changename);
app.post(url.start, start);
app.post(url.setcandidate, setcandidate);
app.post(url.finishspeech, finishspeech);
app.post(url.vote, vote);
app.post(url.mission, mission);
app.post(url.check, check);

module.exports = app;