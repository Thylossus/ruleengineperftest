const receiver = require('./receiver');
const nools = require('nools');

(function() {
  'use strict';

  let Event = function Event(e) {
    // console.log('constructing event with status', e.status);
    this.status = e.status;
  };

  let lastTriggerd = {};
  let timeConstraint = function timeConstraint(e) {
    let valid = (!lastTriggerd[e.status] || Date.now() - lastTriggerd[e.status] > 5000);

    if (valid) {
      lastTriggerd[e.status] = Date.now();
    }

    return valid;
  };

  let flow = nools.flow('demo', (flow) => {
    flow.rule('error', {scope: {timeConstraint: timeConstraint}}, [Event, 'e', 'e.status === "error" && timeConstraint(e)'], (facts) => {
      console.log('received an error event');
    });
    flow.rule('warning', {scope: {timeConstraint: timeConstraint}}, [Event, 'e', 'e.status === "warning" && timeConstraint(e)'], (facts) => {
      console.log('received an warning event');
    });
    flow.rule('ok', {scope: {timeConstraint: timeConstraint}}, [Event, 'e', 'e.status === "ok" && timeConstraint(e)'], (facts) => {
      console.log('received an ok event');
    });
    // flow.rule('error', [Event, 'e', (facts) => {
    //   let valid = facts.e.status === 'error';
    //   valid = valid && (!lastTriggerd['error'] || Date.now() - lastTriggerd['error'] > 5000);
    //
    //   if (valid) {
    //     lastTriggerd['error'] = Date.now();
    //   }
    //
    //   return valid;
    // }], (facts) => {
    //   console.log('received an error event');
    // });

    // flow.rule('warning', [Event, 'e', (facts) => {
    //   let valid = facts.e.status === 'warning';
    //   valid = valid && (!lastTriggerd['warning'] || Date.now() - lastTriggerd['warning'] > 5000);
    //
    //   if (valid) {
    //     lastTriggerd['warning'] = Date.now();
    //   }
    //
    //   return valid;
    // }], (facts) => {
    //   console.log('received a warning event');
    // });
    //
    // flow.rule('ok', [Event, 'e', (facts) => {
    //   let valid = facts.e.status === 'ok';
    //   valid = valid && (!lastTriggerd['ok'] || Date.now() - lastTriggerd['ok'] > 5000);
    //
    //   if (valid) {
    //     lastTriggerd['ok'] = Date.now();
    //   }
    //
    //   return valid;
    // }], (facts) => {
    //   console.log('received an ok event');
    // });

  });

  let session = flow.getSession();

  receiver.on('msg', (msg) => {
    // console.log('applying rules to', msg);
    session.assert(new Event(msg));
    session.match().then(() => {
      // console.log('finished application of rules');
      // console.log(session.getFacts());
      // console.log('#facts =', session.getFacts().length);
    }, (err) => {
      console.error(err.stack);
    });
  });
}());