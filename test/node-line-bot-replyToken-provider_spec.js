const should = require("should");
const helper = require("node-red-node-test-helper");
const nodeLineBotReplyTokenProvider = require("../nodes/node-line-bot-replyToken-provider/node-line-bot-replyToken-provider.js");

helper.init(require.resolve('node-red'));

describe('Line Bot ReplyToken Provider Node', function () {

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
                type: "node-line-bot-replyToken-provider", 
                name: "node-line-bot-replyToken-provider"
            }
        ];
        helper.load(nodeLineBotReplyTokenProvider, flow, () => {
            const n1 = helper.getNode("n1");
            try {
                n1.should.have.property("name", "node-line-bot-replyToken-provider");
                done();
            } catch (err) {
                done(err);
            }
        });
    });
});