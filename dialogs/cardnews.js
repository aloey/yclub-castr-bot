
const builder = require('botbuilder');
const request = require('request-promise');
const moment = require('moment-timezone');
const constants = require('./../constants');
const messages = require('./../messages');

const locale = constants.locale;
const timezone = constants.timezone;
const dateFormat = constants.dateFormat;

module.exports = [
    function (session) {
        session.send(messages.cardNews[locale]);
        request({
            url: constants.urls.cardNews,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => {
                const cardNewss = JSON.parse(response).data.cardNews;
                let cardNewsTable = '## Card News\n---\n|Date||Title|\n|:---|---|:---|';
                if (cardNewss.length > 0) {
                    cardNewss.forEach((cardNews) => {
                        cardNewsTable += `\n|${moment.tz(cardNews.date, timezone).format(dateFormat[locale].display)}||[${cardNews.name}](${cardNews.link})|`;
                    });
                } else {
                    cardNewsTable += '\n|No||Card news|';
                }
                const customMessage = new builder.Message(session)
                    .text(cardNewsTable)
                    .textFormat('markdown');
                // .textLocale("en-us");
                session.send(customMessage);
                builder.Prompts.choice(session, messages.return[locale], constants.mainMenu[locale], { listStyle: 3 });
            });
    },
    function (session, results) {
        if (results.response) {
            if (results.response.entity === constants.mainMenu[locale]) {
                session.beginDialog(constants.features.MAIN);
            }
        }
    }
];
