module.exports = function (RED) {
    function LineMessagingApiConfig(n) {
        RED.nodes.createNode(this, n);
        this.token = n.token;
        this.secret = n.secret;
    }

    RED.nodes.registerType("line-messaging-api-config", LineMessagingApiConfig, {
        credentials: {
            token: {
                type: "text",
                required: true
            },
            secret: {
                type: "text",
                require: true
            }
        }
    });
}
