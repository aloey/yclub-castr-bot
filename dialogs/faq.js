
const builder = require('botbuilder');
const request = require('request-promise');
const constants = require('./../constants');
const messages = require('./../messages');

const locale = constants.locale;

module.exports = [
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
];