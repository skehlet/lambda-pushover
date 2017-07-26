'use strict';

const lambdaHandlerPromiseWrapper = require('lambda-handler-promise-wrapper');
const Pushover = require('pushover-notifications');
const Promise = require('bluebird');
const _ = require('lodash');

function push(message, title, sound) {
    title = title || _.first(message.split(' '));
    sound = sound || 'bugle';

    const pushover = new Pushover({
        token: process.env['PUSHOVER_TOKEN'],
        user: process.env['PUSHOVER_USER']
    });

    Promise.promisifyAll(pushover);

    const msg = {
        message: message,
        title: title,
        sound: sound
    };

    return pushover.sendAsync(msg);  
}

exports.handler = lambdaHandlerPromiseWrapper(function (event, context) {
    console.log('Received event:', JSON.stringify(event, null, 4));
    const subject = event.Records[0].Sns.Subject;
    const message = event.Records[0].Sns.Message;
    return push(message, subject);
});