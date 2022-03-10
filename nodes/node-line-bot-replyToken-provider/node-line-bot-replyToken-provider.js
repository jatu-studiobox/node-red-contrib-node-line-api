'use strict';

module.exports = function (RED) {
    // Setting Error function
    function setError(node, message) {
        node.error(message);
        node.status({ fill: "red", shape: "ring", text: message.payload });
    }

    function NodeLineBotReplyTokenProvider(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        node.on('input', async (msg) => {
            try {
                console.log("msg.payload: ", msg.payload);
                if (msg.payload.events.length > 0) {
                    msg.payload.events.forEach(event => {
                        node.send({
                            payload: event,
                            replyToken: event.replyToken
                        });
                    });
                } else {
                    msg.status = -1;
                    msg.payload = RED._("node-line-bot-replyToken-provider.error.notHasEvents");
                    setError(node, msg);
                }         
            } catch (error) {
                msg.status = -1;
                msg.payload = error;
                setError(node, msg);
            }
        });
    }

    RED.nodes.registerType("node-line-bot-replyToken-provider", NodeLineBotReplyTokenProvider);
}
