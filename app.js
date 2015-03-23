// Load process.env from file
require('dotenv').load();

// Logger
var log = require('./logger.js')();

// Door
var door = require('./door.js');

// Const
var CLIENT = {
  broker_id: process.env.BROKERID,
  client_type: 'broker'
};
var DOOR_UNLOCK_DURATION = 4000;

// Strat
log.info('App started');

// Connect socket
var socket = require('socket.io-client')(process.env.SERVER);

/**
 * Upon socket connected, idnetify myself and join the room
 */
socket.on('connect', function() {
  log.info('Server connected');
  socket.emit('client:connect', CLIENT);
});

/**
 * When someone(myself or other devices) joined my room
 *
 * @data {broker_id, client_type}
 */
socket.on('client:connected', function(data) {
  log.info('Client connected', data);
});

/**
 * Process when instruction come in
 *
 * @data {object_type, object_id, action, meta}
 */
socket.on('instruction', function(data) {
  var object_type = data.object_type;
  var action = data.action;
  var meta = data.meta || {};
  if (object_type == 'door') {
    if (action == 'lock') {
      door.lock();
      data.action = "locked";
      socket.emit('notification', data);
    } else if (action == 'unlock') {
      var duration = meta.duration || DOOR_UNLOCK_DURATION;
      door.unlock(duration,
        function() {
          data.action = "unlocked";
          socket.emit('notification', data);
        },
        function() {
          data.action = "locked";
          socket.emit('notification', data);
        });
    } else {
      log.info('Unrecognized instruction action', data);
    }
  } else {
    log.info('Unrecognized instruction object', data);
  }
});

/**
 * Socket disconnect handler
 */
socket.on('disconnect', function() {
  log.info('Server disconnected');
});

/**
 * Socket error handler
 */
socket.on('error', function(err) {
  socket.disconnect();
  socket.connect();
});