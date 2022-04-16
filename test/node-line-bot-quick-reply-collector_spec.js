const should = require("should");
const helper = require("node-red-node-test-helper");
const nodeLineBotQuickReplyCollector = require("../nodes/node-line-bot-quick-reply-collector/node-line-bot-quick-reply-collector.js");

helper.init(require.resolve('node-red'));

describe('Line Bot Quick Reply Collector Node', function () {

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
                type: "node-line-bot-quick-reply-collector",
                name: "node-line-bot-quick-reply-collector"
            }
        ];
        helper.load(nodeLineBotQuickReplyCollector, flow, () => {
            const n1 = helper.getNode("n1");
            try {
                n1.should.have.property("name", "node-line-bot-quick-reply-collector");
                done();
            } catch (err) {
                done(err);
            }
        });
    });
});