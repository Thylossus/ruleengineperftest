const amqp = require('amqplib');
const random = require('lodash/random');

const EXCHANGE = 'demo';

(function() {
  'use strict';
  let toBuffer = function toBuffer(obj) {
    return new Buffer(JSON.stringify(obj));
  };

  let status = ['error', 'warning', 'ok'];

  exports.start = (interval) => {
    let open = amqp.connect('amqp://192.168.99.100:32769');
    open.then((conn) => {
      conn.createChannel().then((channel) => {
        channel.assertQueue(EXCHANGE);
        setInterval(() => {
          let e = {
            status: status[random(0, status.length - 1)]
          };
          console.log('sending', JSON.stringify(e));
          channel.sendToQueue(EXCHANGE, toBuffer(e));
        }, interval);
      });
    });
  };

}());