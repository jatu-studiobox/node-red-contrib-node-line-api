const should = require("should");
const helper = require("node-red-node-test-helper");
const nodeLineNotify = require("../nodes/node-line-notify.js");

helper.init(require.resolve('node-red'));

describe('Line Notify Node', function () {

    beforeEach((done) => {
        helper.startServer(done);
    });

    afterEach((done) => {
        helper.unload();
        helper.stopServer(done);
    });

    it('should be loaded', (done) => {
        const flow = [{ id: "n1", type: "node-line-notify", name: "node-line-notify", useExternalData: true }];
        helper.load(nodeLineNotify, flow, () => {
            var n1 = helper.getNode("n1");
            try {
                n1.should.have.property("name", "node-line-notify");
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
                type: "node-line-notify", 
                name: "node-line-notify", 
                message: "test", 
                useExternalData: false 
            }
        ];
        helper.load(nodeLineNotify, flow, () => {
            const n1 = helper.getNode("n1");
            n1.on("call:error", (err) => {
                should.equal(err.lastArg.payload, "node-line-notify.errors.notFoundToken");
                should.equal(err.lastArg.status, -1);
                done();
            });
            n1.receive({});
        });
    });

    // it("error token", (done) => {
    //     const flow = [
    //         {
    //             id: "n1",
    //             type: "node-line-notify",
    //             name: "node-line-notify",
    //             message: "test",
    //             useExternalData: false,
    //             useImageUrl: false,
    //             useImageFile: false,
    //             useSticker: false,
    //             wires: [["n2"]]
    //         },
    //         { id: "n2", type: "helper" }
    //     ];
    //     helper.load(nodeLineNotify, flow, {token: "test"}, () => {
    //         const n1 = helper.getNode("n1");
    //         const n2 = helper.getNode("n2");

    //         n1.on("call:error", (err) => {
    //             console.log(n1);
    //             should.equal(err.lastArg.status, 401);
    //             should.equal(err.lastArg.payload, "Invalid access token");
    //             done();
    //         });
    //         n1.receive({ payload: "test" });
    //     });
    // });
});