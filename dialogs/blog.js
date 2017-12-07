
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
        session.send(messages.blog[locale]);
        request({
            url: constants.urls.blog,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => {
                const blogs = JSON.parse(response).data.blogs;
                let blogTable = '## Blogs\n---\n|Date||Title|\n|:---|---|:---|';
                if (blogs.length > 0) {
                    blogs.forEach((blog) => {
                        blogTable += `\n|${moment.tz(blog.date, timezone).format(dateFormat[locale].display)}||[${blog.name}](${blog.link})|`;
                    });
                } else {
                    blogTable += '\n|No||Blogs|';
                }
                const customMessage = new builder.Message(session)
                    .text(blogTable)
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
