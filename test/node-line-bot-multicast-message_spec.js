const should = require("should");
const helper = require("node-red-node-test-helper");
const nodeLineBotPushMessage = require("../nodes/node-line-bot-multicast-message/node-line-bot-multicast-message.js");

helper.init(require.resolve('node-red'));

describe('Line Bot Multicast Message Node', function () {

    beforeEach((done) => {
        helper.startServer(done);
    });

    afterEach((done) => {
        helper.unload();
        helper.stopServer(done);
    });

    it('should be loaded', (done) => {
        const flow = [{ id: "n1", type: "node-line-bot-multicast-message", name: "node-line-bot-multicast-message" }];
        helper.load(nodeLineBotPushMessage, flow, () => {
            var n1 = helper.getNode("n1");
            try {
                n1.should.have.property("name", "node-line-bot-multicast-message");
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
                type: "node-line-bot-multicast-message", 
                name: "node-line-bot-multicast-message", 
                message: "test message", 
                useExternalData: false
            }
        ];
        helper.load(nodeLineBotPushMessage, flow, () => {
            const n1 = helper.getNode("n1");
            n1.on("call:error", (err) => {
                should.equal(err.lastArg.payload, "node-line-bot-multicast-message.errors.notFoundToken");
                should.equal(err.lastArg.status, -1);
                done();
            });
            n1.receive({});
        });
    });
});