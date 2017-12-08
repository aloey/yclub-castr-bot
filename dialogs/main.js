
const builder = require('botbuilder');
const constants = require('./../constants');
const messages = require('./../messages');

const locale = constants.locale;

module.exports = [
    function (session) {
        builder.Prompts.choice(session, messages.greeting[locale], constants.mainOptions[locale], { listStyle: 3 });
    },
    function (session, results) {
        session.beginDialog(constants.mainOptions[locale][results.response.entity]);
    }
];