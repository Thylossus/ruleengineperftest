const amqp = require('amqplib');
const EventEmitter = require('events');

const EXCHANGE = 'demo';

(function() {
  'use strict';

  let open = amqp.connect('amqp://192.168.99.100:32773');
  class Receiver extends EventEmitter {};
  let receiver = new Receiver();

  open.then((conn) => {
    conn.createChannel().then((channel) => {
      channel.assertQueue(EXCHANGE);
      channel.consume(EXCHANGE, (msg) => {
        if (msg) {
          let text = msg.content.toString();
          let json = JSON.parse(text);
          // console.log(text);
          channel.ack(msg);
          receiver.emit('msg', json);
        }
      });
    });
  });

  module.exports = receiver;

}());