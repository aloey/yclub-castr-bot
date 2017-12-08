/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

'use strict';

const restify = require('restify');
const builder = require('botbuilder');
const azure = require('botbuilder-azure');
const constants = require('./constants');

const mainDialog = require('./dialogs/main');
const faqDialog = require('./dialogs/faq');
const infoDialog = require('./dialogs/info');
const supportDialog = require('./dialogs/support');
const reportDialog = require('./dialogs/report');

require('dotenv').config();

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
]).set('storage', tableStorage);
// bot.name = 'Castr';

// Dialog - Main menu
bot.dialog(constants.features.main, mainDialog)
    .triggerAction({
        matches: [
            new RegExp(`^${constants.mainMenu.kr.replace(' ', '\\s*')}$`, 'gi'),
            new RegExp(`^${constants.mainMenu.en.replace(' ', '\\s*')}$`, 'gi')
        ],
    });

// Dialog - FAQ
bot.dialog(constants.features.faq, faqDialog);

// Dialog - Information
bot.dialog(constants.features.info, infoDialog);

// Dialog - Support
bot.dialog(constants.features.support, supportDialog);

// Dialog - Report
bot.dialog(constants.features.report, reportDialog);

// Initiate main menu on start
bot.on('conversationUpdate', (message) => {
    if (message.membersAdded) {
        message.membersAdded.forEach((identity) => {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, constants.features.main);
            }
        });
    }
});
