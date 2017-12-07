
const builder = require('botbuilder');
const request = require('request-promise');
const moment = require('moment-timezone');
const constants = require('./../constants');
const messages = require('./../messages');

const locale = constants.locale;
const timezone = constants.timezone;
const dateFormat = constants.dateFormat;
const timeFormat = constants.timeFormat;

module.exports = [
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
];
