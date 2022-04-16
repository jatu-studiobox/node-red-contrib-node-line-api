const should = require("should");
const helper = require("node-red-node-test-helper");
const nodeLineBotQuickReplyItem = require("../nodes/node-line-bot-quick-reply-item/node-line-bot-quick-reply-item.js");

helper.init(require.resolve('node-red'));

describe('Line Bot Quick Reply Item Node', function () {

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
                type: "node-line-bot-quick-reply-item",
                name: "node-line-bot-quick-reply-item"
            }
        ];
        helper.load(nodeLineBotQuickReplyItem, flow, () => {
            const n1 = helper.getNode("n1");
            try {
                n1.should.have.property("name", "node-line-bot-quick-reply-item");
                done();
            } catch (err) {
                done(err);
            }
        });
    });
});