const should = require("should");
const helper = require("node-red-node-test-helper");
const nodeLineBotBroadcastMessage = require("../nodes/node-line-bot-broadcast-message/node-line-bot-broadcast-message.js");
const lineMessagingApiConfig = require("../nodes/line-messaging-api-config/line-messaging-api-config.js");

helper.init(require.resolve('node-red'));

describe('Line Bot Broadcast Message Node', function () {

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
                type: "node-line-bot-broadcast-message", 
                name: "node-line-bot-broadcast-message",
                apiConfig: "apiConfig"
            },
            {
                id: "apiConfig",
                type: "line-messaging-api-config",
                name: "Bot-Name"
            }
        ];
        helper.load([nodeLineBotBroadcastMessage, lineMessagingApiConfig], flow, { apiConfig: { token: "tokenValue", secret: "secretValue" } }, () => {
            const n1 = helper.getNode("n1");
            const apiConfig = helper.getNode("apiConfig");
            try {
                n1.should.have.property("name", "node-line-bot-broadcast-message");
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it("should make payload without token", (done) => {
        const flow = [
            { 
                id: "n1", 
                type: "node-line-bot-broadcast-message", 
                name: "node-line-bot-broadcast-message",
                useExternalMessage: false, 
                message: "Test Message",
                messageType: 0,
                apiConfig: "apiConfig"
            },
            {
                id: "apiConfig",
                type: "line-messaging-api-config",
                name: "Bot-Name"
            }
        ];
        helper.load([nodeLineBotBroadcastMessage, lineMessagingApiConfig], flow, { apiConfig: {} }, () => {
            const n1 = helper.getNode("n1");
            const apiConfig = helper.getNode("apiConfig");
            n1.on("call:error", (err) => {
                should.equal(err.lastArg.payload, "node-line-bot-broadcast-message.errors.notFoundToken");
                should.equal(err.lastArg.status, -1);
                done();
            });
            n1.receive({});
        });
    });
});