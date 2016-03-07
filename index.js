const sender = require('./sender');

(function() {
  'use strict';
  // Start some senders
  sender.start(2);
  sender.start(2);
  sender.start(2);
  sender.start(2);
  sender.start(2);
  sender.start(2);

}());