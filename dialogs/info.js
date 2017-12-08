
const builder = require('botbuilder');
const request = require('request-promise');
const moment = require('moment-timezone');
const constants = require('./../constants');
const messages = require('./../messages');

const locale = constants.locale;
const timezone = constants.timezone;
const dateFormat = constants.dateFormat;

const fetch = topic => new Promise((resolve, reject) => {
    request({
        url: constants.urls.blog,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        qs: { topic: topic },
        json: true,
    })
        .then((response) => {
            resolve(response.data);
        })
        .catch((err) => {
            reject(err);
        });
});

module.exports = [
    function (session) {
        builder.Prompts.choice(session, messages.info[locale], constants.infoSubOptions[locale], { listStyle: 3 });
    },
    function (session, results) {
        if (results.response) {
            const selectedTopic = constants.infoSubOptions[locale][results.response.entity];
            fetch(selectedTopic)
                .then((entries) => {
                    session.send();
                    let entryListText = `${messages.subInfo[selectedTopic][locale]}\n\n---\n`;
                    if (entries.length > 0) {
                        entries.forEach((entry) => {
                            entryListText += `* [${entry.title}](${entry.link})\n\n`;
                        });
                    } else {
                        entryListText += 'No entries';
                    }
                    session.send(entryListText);
                    session.send(messages.return[locale]);
                })
                .catch((err) => {
                    throw err;
                });
        }
    }
];
