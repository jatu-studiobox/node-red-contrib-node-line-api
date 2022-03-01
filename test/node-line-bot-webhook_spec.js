const should = require("should");
const helper = require("node-red-node-test-helper");
const nodeLineBotWebhook = require("../nodes/node-line-bot-webhook/node-line-bot-webhook.js");

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
        const flow = [{ id: "n1", type: "node-line-bot-webhook", name: "node-line-bot-webhook" }];
        helper.load(nodeLineBotWebhook, flow, () => {
            var n1 = helper.getNode("n1");
            try {
                n1.should.have.property("name", "node-line-bot-webhook");
                done();
            } catch (err) {
                done(err);
            }
        });
    });
});