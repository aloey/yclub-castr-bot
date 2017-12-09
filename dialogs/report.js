
const builder = require('botbuilder');
const request = require('request-promise');
const moment = require('moment-timezone');
const constants = require('./../constants');
const messages = require('./../messages');

const locale = constants.locale;
const timezone = constants.timezone;

const accountId = '5a1426f8ee184c16f3847195';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjoiRmUyNi4yKio3OTg1Y2Y0MTFkOWIxYjI5NjJjZDI3MTFkOWVmNTc2YzJmMmRjNzk2ZDEzMzQ4N2VhNGUwY2UyMmJkNTVmYmE2Km8xdzkzLWNhOEJzMWFDcmtsTGlmMEEqZVF6NXgwNFR2QU5DeDUxWkotcEdld0ZnTlE3WWFMSVFLcXNDRzRGSHRzMnQwZURhTGpBeE9LMS1KYllIcmdzRXJ2NG93NHZqZHIwTGZoQXUzNUNOQ2lXUC1US0hiTmNSWEVtdDZTYkYtLTd2ZnBWMkhXVmh2MEhsdUFIWmdnYUhFVGd3d2JNTjJxWVdYVWVVcFQzemVPamRrVzBUQjE5cVhoeGw4RmlzQ2xmVmsycF9tSWVxdG5iZUhFZW4tb2taQ21BMnM2TjMxc2YzekJvX0R5OE4wVDJJdHJYT0lScU1lTzZ6T1VtM0h0azRndmZKajdMbnZOdll2ZUREU3NwWGtLTTZIZmhwRkFqdE91TEV4NkwtOTNrcWEyQmNvYml6cXNoSjd6Vzc1U184V1FTUWhCNWQ1REY0RVhnWVQ5MDVwSGJoZUM4Zm1mUms3bXhhbllzX1hOT0tHXzBWenlsOWFUa1BNSTFTdjdqLUxNTk1jRnZZR0tTRjZXUHAzVTJsKipjNTUzNTM4MjgwMDVkZjg4M2U1ZTI4MmFmYThjYjUxZTI5NjdjOTNjZTg5MTk5ZTVmYjVmZTVmN2VhMDQ0ZTRkKkdaTDRtaFdUM3BJUmgybUhoN3h0SHN4Vlp0cFlCNGZvUHA4NmQ2LUh4bzQiLCJpYXQiOjE1MTI3MTEzNTMsImV4cCI6MTUxNTMwMzM1M30.VP7dv45e_YYXguIprb-fH1cav85Y1Sy7v_sWSvJiUhg';

module.exports = [
    function (session, args, next) {
        session.send('안녕하세요. 캐스터입니다. 어카운트 고유 ID를 입력해주시기 바랍니다.');
        next();
    },
    function (session, results, next) {
        request({
            url: constants.urls.business(accountId),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            json: true,
        })
            .then((response) => {
                const businesses = response.data.map(biz => ({ id: biz._id, name: biz.name }));
                session.dialogData.businesses = {};
                businesses.forEach((biz) => { session.dialogData.businesses[biz.name] = biz.id; });
                if (businesses.length > 1) {
                    builder.Prompts.choice(session, '궁금하신 비즈니스를 선택해 주시기 바랍니다.', businesses.map(biz => biz.name), { listStyle: 3 });
                } else if (businesses.length === 1) {
                    next({ response: businesses[0].name });
                } else {
                    session.endConversation('No businesses').beginDialog(constants.features.main);
                }
            })
            .catch((err) => {
                session.endConversation(err.message).beginDialog(constants.features.main);
            });
    },
    function (session, results, next) {
        if (results.response) {
            const businessId = session.dialogData.businesses[results.response.entity || results.response];
            session.dialogData.castrBizId = businessId;
            request({
                url: constants.urls.promotion(businessId),
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token },
                qs: { status: 'ACTIVE' },
                json: true,
            })
                .then((response) => {
                    let promotions = response.data.map(promo => ({ id: promo._id, title: promo.title }));
                    session.dialogData.promotions = {};
                    promotions.forEach((promo) => { session.dialogData.promotions[promo.title] = promo.id; });
                    if (promotions.length > 1) {
                        promotions = [{ id: 'ALL', title: 'All' }].concat(promotions);
                        builder.Prompts.choice(session, '궁금하신 프로모션을 선택해주시기 바랍니다.\n\n*종료된 프로모션의 경우 웹사이트에서 확인해주세요.', promotions.map(promo => promo.title), { listStyle: 3 });
                    } else if (promotions.length === 1) {
                        next({ response: promotions[0].title });
                    } else {
                        session.endConversation('No promotions').beginDialog(constants.features.main);
                    }
                })
                .catch((err) => {
                    session.endConversation(err.message).beginDialog(constants.features.main);
                });
        }
    },
    function (session, results) {
        if (results.response) {
            const promotionId = session.dialogData.promotions[results.response.entity || results.response];
            session.dialogData.promotionId = promotionId;
            builder.Prompts.choice(session, '궁금하신 기간을 선택해주시기 바랍니다.', constants.durationOptions[locale], { listStyle: 3 });
        }
    },
    function (session, results, next) {
        if (results.response) {
            const duration = constants.durationOptions[locale][results.response.entity];
            let dateRange;
            if (duration === constants.duration.today) {
                const today = moment.tz(timezone).format('YYYYMMDD');
                dateRange = `${today},${today}`;
            } else if (duration === constants.duration.yesterday) {
                const yesterday = moment.tz(timezone).subtract(1, 'day').format('YYYYMMDD');
                dateRange = `${yesterday},${yesterday}`;
            } else if (duration === constants.duration.week) {
                const today = moment.tz(timezone);
                const start = moment(today).subtract(1, 'week').add(1, 'day');
                dateRange = `${start.format('YYYYMMDD')},${today.format('YYYYMMDD')}`;
            } else if (duration === constants.duration.week4) {
                const today = moment.tz(timezone);
                const start = moment(today).subtract(4, 'week').add(1, 'day');
                dateRange = `${start.format('YYYYMMDD')},${today.format('YYYYMMDD')}`;
            }
            request({
                url: constants.urls.report,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                qs: {
                    castrBizId: session.dialogData.castrBizId,
                    promotionId: session.dialogData.promotionId,
                    dateRange: dateRange,
                    locale: locale,
                },
                json: true,
            })
                .then((response) => {
                    const report = response.data;
                    let reportText = '';
                    Object.keys(messages.reportFields[locale]).forEach((field) => {
                        reportText += `${field}: ${messages.reportFields[locale][field](report)}`;
                    });
                    session.send(reportText);
                })
                .catch((err) => {
                    session.endConversation(err.message).beginDialog(constants.features.main);
                });
        }
    },
    function (session, results) {

    }
];

