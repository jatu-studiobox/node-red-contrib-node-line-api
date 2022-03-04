const should = require("should");
const helper = require("node-red-node-test-helper");
const nodeLineBotWebhook = require("../nodes/node-line-bot-webhook/node-line-bot-webhook.js");
const lineMessagingApiConfig = require("../nodes/line-messaging-api-config/line-messaging-api-config.js");

helper.init(require.resolve('node-red'));

describe('Line Bot Webhook Node', function () {

    beforeEach((done) => {
        helper.startServer(done);
    });

    afterEach((done) => {
        helper.unload();
        helper.stopServer(done);
    });

    it('should be loaded', (done) => {
        const flow = [
            { 
                id: "n1", 
                type: "node-line-bot-webhook", 
                name: "node-line-bot-webhook",
                apiConfig: "apiConfig" 
            },
            {
                id: "apiConfig",
                type: "line-messaging-api-config",
                name: "Bot-Name"
            }
        ];
        helper.load([nodeLineBotWebhook, lineMessagingApiConfig], flow, { apiConfig: { token: "tokenValue", secret: "secretValue" } }, () => {
            const n1 = helper.getNode("n1");
            const apiConfig = helper.getNode("apiConfig");
            try {
                n1.should.have.property("name", "node-line-bot-webhook");
                done();
            } catch (err) {
                done(err);
            }
        });
    });
});