/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

'use strict';

const restify = require('restify');
const builder = require('botbuilder');
const azure = require('botbuilder-azure');
const constants = require('./constants');
const messages = require('./messages');
const request = require('request-promise');
const moment = require('moment-timezone');

require('dotenv').config();

const locale = 'kr';
const timezone = 'Asia/Seoul';
const dateFormat = constants.dateFormat;
const timeFormat = constants.timeFormat;

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('%s listening to %s', server.name, server.url);
});

// Table storage
const tableName = 'castrbot'; // You define
const storageName = 'castrbot'; // Obtain from Azure Portal
const storageKey = 'Dq1jlPtzCISD+D6dD+Plmcg7QGBB4wgWLE/AjP+N9yXCOv3RGEroKnt8+AfoRnYmFyy7uOvnkcagxpXDM5GrMw=='; // Obtain from Azure Portal

const azureTableClient = new azure.AzureTableClient(tableName, storageName, storageKey);
const tableStorage = new azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata,
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
const bot = new builder.UniversalBot(connector, [
    // function (session, results) {
    //     session.beginDialog(constants.features.MAIN);
    // },
    // function (session, results) {
    // session.beginDialog();
    /* switch (constants.mainOptions[locale][results.response.entity]) {
        case constants.features.FAQ: {
            session.beginDialog(constants.features.FAQ);
            break;
        }
        case constants.features.BLOG: {
            session.beginDialog(constants.features.BLOG);
            break;
        }
        case constants.features.CARD_NEWS: {
            session.beginDialog(constants.features.CARD_NEWS);
            break;
        }
        case constants.features.SUPPORT: {
            session.beginDialog(constants.features.SUPPORT);
            break;
        }
        case constants.features.REPORT: {
            session.beginDialog(constants.features.REPORT);
            break;
        }
        default:
            break;
    } */
    // }
]).set('storage', tableStorage);
// bot.name = 'Castr';

// Dialog - Main menu
bot.dialog(constants.features.MAIN, [
    function (session) {
        // session.userData.testKey = 1;
        // session.save();
        builder.Prompts.choice(session, messages.greeting[locale], constants.mainOptions[locale], { listStyle: 3 });
    },
    function (session, results) {
        session.beginDialog(constants.mainOptions[locale][results.response.entity]);
    }
])
    .triggerAction({ matches: new RegExp(`^${constants.mainMenu.en.replace(' ', '\\s*')}$`, 'gi') })
    .triggerAction({ matches: new RegExp(`^${constants.mainMenu.kr}$`, 'gi') });

// Dialog - FAQ
bot.dialog(constants.features.FAQ, [
    function (session, args) {
        if (args && args.reprompt) {
            builder.Prompts.text(session, `${messages.faqCont[locale]} ${messages.return[locale]}`);
        } else {
            builder.Prompts.text(session, `${messages.faq[locale]} ${messages.return[locale]}`);
        }
    },
    function (session, results) {
        if (results.response) {
            const question = results.response;
            // FAQ 호출
            const lQnaMakerServiceEndpoint = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/';
            const lQnaApi = 'generateAnswer';
            const lKnowledgeBaseId = '8d685388-f4ab-4a0e-ad10-19f3f77ba011';
            const lSubscriptionKey = 'f61eace6ff2a4e87adf0fe3074b10651';
            const lKbUri = `${lQnaMakerServiceEndpoint + lKnowledgeBaseId}/${lQnaApi}`;
            request({
                url: lKbUri,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': lSubscriptionKey,
                },
                body: `{"question":"${question}"}`,
            })
                .then((response) => {
                    let stopQNA;
                    const lResult = JSON.parse(response);
                    session.send(lResult.answers[0].answer);
                    session.replaceDialog(constants.features.FAQ, { reprompt: true });
                })
                .catch((err) => {
                    let lResult;
                    lResult.answer = 'Unfortunately an error occurred. Try again.(fQnAMaker)';
                    lResult.score = 0;
                    session.send(lResult.answers[0].answer);
                    session.replaceDialog(constants.features.FAQ, { reprompt: true });
                });
        }
    }
]);

// Dialog - Blog
bot.dialog(constants.features.BLOG, [
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
                session.send(messages.return[locale]);
            });
    }
]);

// Dialog - Card News
bot.dialog(constants.features.CARD_NEWS, [
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
                session.send(messages.return[locale]);
            });
    }
]);

// Dialog - Support
bot.dialog(constants.features.SUPPORT, [
    function (session, args, next) {
        session.conversationData.support = session.conversationData.support || {};
        if (args && args.customDate) {
            // Custom date prompt
            builder.Prompts.text(session, messages.customDate[locale]);
        } else {
            // Date option prompt (default)
            if (!(args && args.changeDate) && session.conversationData.support.selectedDate) return next();
            if (!(args && args.reprompt)) session.send(messages.support[locale]);
            request({
                url: constants.urls.supportDateTime,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                qs: { type: 'date' },
                json: true,
            })
                .then((response) => {
                    const dates = response.data.date;
                    // let blogTable = '## Blogs\n---\n|Date||Title|\n|:---|---|:---|';
                    if (dates.length > 0) {
                        session.conversationData.support.dates = {};
                        const dateOptions = dates.map((date) => {
                            const dateObj = moment.tz(date, 'MMDDYYYY', timezone);
                            const formattedDate = dateObj.format(dateFormat[locale].display);
                            const dayOfWeek = dateObj.weekday();
                            const dateString = `${formattedDate} (${dayOfWeek})`;
                            session.conversationData.support.dates[dateString] = date;
                            return dateString;
                        });
                        dateOptions.push(constants.custom[locale]);
                        builder.Prompts.choice(session, messages.supportDate[locale], dateOptions, { listStyle: 3 });
                        session.send(messages.return[locale]);
                    }
                });
        }
    },
    function (session, results, next) {
        if (session.conversationData.support.selectedTime) return next();
        if (Object.values(constants.custom).includes(results.response.entity)) {
            // Custom date option selected
            return session.replaceDialog(constants.features.SUPPORT, { customDate: true, reprompt: true });
        }
        if (session.conversationData.support.dates.hasOwnProperty(results.response.entity)) {
            // Option selected
            session.conversationData.support.selectedDate = {
                display: results.response.entity,
                date: session.conversationData.support.dates[results.response.entity],
            };
        } else if (results.response.match(dateFormat[locale].pattern)) {
            // Custom date entered
            const matchStr = results.response.match(dateFormat[locale].pattern);
            const selectedDate = dateFormat[locale].ord.map((index) => {
                if (index < 3) return `0${matchStr[index]}`.slice(-2);
                return matchStr[index];
            }).join('');
            const dateObj = moment.tz(selectedDate, 'MMDDYYYY', timezone);
            const now = moment.tz(timezone);
            const bound = moment(now).add(constants.appointmentBound, 'month');
            if (dateObj.diff(now) < 0 || bound.diff(dateObj) < 0) {
                // Custom date incorrect date
                session.send(messages.badDate[locale]);
                return session.replaceDialog(constants.features.SUPPORT, { customDate: true, reprompt: true });
            }
            session.conversationData.support.selectedDate = {
                display: dateObj.format(dateFormat[locale].display),
                date: selectedDate,
            };
        } else {
            // Custom date incorrect format
            session.send(messages.badFormat[locale]);
            return session.replaceDialog(constants.features.SUPPORT, { customDate: true, reprompt: true });
        }
        request({
            url: constants.urls.supportDateTime,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            qs: { type: 'time', date: session.conversationData.support.selectedDate.date },
            json: true,
        })
            .then((response) => {
                const times = response.data.time;
                // let blogTable = '## Blogs\n---\n|Date||Title|\n|:---|---|:---|';
                if (times.length > 0) {
                    session.conversationData.support.times = {};
                    const timeOptions = times.map((time) => {
                        const timeObj = moment.tz(timezone).hour(time.hour).minute(time.minute);
                        const formattedTime = timeObj.format(timeFormat[locale]);
                        const timeString = formattedTime;
                        session.conversationData.support.times[timeString] = time.schedule;
                        return timeString;
                    });
                    timeOptions.push(constants.changeDate[locale]);
                    builder.Prompts.choice(session, ' ', timeOptions, { listStyle: 3 });
                    // session.send(messages.return[locale]);
                } else {
                    // No available time found for the chosen date
                    session.send(messages.nonAvailable[locale]);
                    session.replaceDialog(constants.features.SUPPORT, { changeDate: true, reprompt: true });
                }
            });
    },
    function (session, results, next) {
        if (session.conversationData.support.privPolicyConfirmed) return next();
        if (Object.values(constants.changeDate).includes(results.response.entity)) {
            // Change date requested
            session.replaceDialog(constants.features.SUPPORT, { changeDate: true, reprompt: true });
        } else if (session.conversationData.support.times.hasOwnProperty(results.response.entity)) {
            // Option selected
            session.conversationData.support.selectedTime = {
                display: results.response.entity,
                schedule: session.conversationData.support.times[results.response.entity],
            };
            session.send(messages.privPolicyWarn[locale]);
            builder.Prompts.choice(session, messages.privPolicyText[locale], constants.confirm[locale], { listStyle: 3 });
        }
    },
    function (session, results) {
        if (session.conversationData.support.privPolicyConfirmed || constants.confirm[locale][results.response.entity] === constants.answer.yes) {
            session.conversationData.support.privPolicyConfirmed = true;
            builder.Prompts.text(session, messages.namePhone[locale]);
        } else {
            session.send(messages.privInfoNotAllowed[locale]);
            session.endConversation().beginDialog(constants.features.MAIN);
        }
    },
    function (session, results) {
        if (results.response) {
            const nameMatch = results.response.match(constants.nameFormat);
            const phoneMatch = results.response.match(constants.phoneFormat);
            if (!nameMatch || !phoneMatch) {
                session.send(messages.badFormat[locale]);
                session.replaceDialog(constants.features.SUPPORT, { reprompt: true });
                return;
            }
            session.conversationData.support.name = nameMatch[1];
            session.conversationData.support.phoneNumber = `${phoneMatch[1]}-${phoneMatch[2]}-${phoneMatch[3]}`;
            builder.Prompts.text(session, messages.question[locale](nameMatch[1]));
        }
    },
    function (session, results) {
        if (results.response) {
            const data = session.conversationData.support;
            request({
                url: constants.urls.supportDateTime,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: {
                    name: data.name,
                    phone: data.phoneNumber,
                    date: data.selectedDate.date,
                    schedule: data.selectedTime.schedule,
                    question: results.response,
                },
                json: true,
            })
                .then((response) => {
                    if (response.success) {
                        session.send(messages.supportSuccess[locale](session.conversationData.support));
                    } else {
                        session.send('Failed to make appointment. API failture.');
                    }
                    session.endConversation().beginDialog(constants.features.MAIN);
                });
        }
    }
]);

// Initiate main menu on start
bot.on('conversationUpdate', (message) => {
    if (message.membersAdded) {
        message.membersAdded.forEach((identity) => {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, constants.features.MAIN);
            }
        });
    }
});
