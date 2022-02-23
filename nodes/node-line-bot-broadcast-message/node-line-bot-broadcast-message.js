'use strict';
const lineBot = require('@line/bot-sdk');

module.exports = function (RED) {
    // Setting Error function
    function setError(node, message) {
        node.error(message);
        node.status({ fill: "red", shape: "ring", text: message.payload });
    }
    // Validate External Message function
    function validateExternalMessage(msg) {
        let result = {
            isError: false,
            message: ""
        };
        // validate messageType section
        if (typeof msg.messageType !== 'undefined') {
            if (typeof msg.messageType !== 'number') {
                result.isError = true;
                result.message = RED._("node-line-bot-broadcast-message.errors.messageTypeInvalid");
            } else if (!Number.isInteger(msg.messageType)) {
                result.isError = true;
                result.message = RED._("node-line-bot-broadcast-message.errors.messageTypeInvalid");
            } else if (!(msg.messageType === 0 || msg.messageType === 1)) {  // 0 = normal message, 1 = custom whole message JSON format
                result.isError = true;
                result.message = RED._("node-line-bot-broadcast-message.errors.messageTypeInvalid");
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-bot-broadcast-message.errors.messageTypeRequired");
        }
        if (result.isError) {
            return result;
        }
        // validate message section
        if (typeof msg.payload !== 'undefined') {
            if (msg.messageType === 0) {
                if (typeof msg.payload !== 'string') {
                    result.isError = true;
                    result.message = RED._("node-line-bot-broadcast-message.errors.messageInvalid");
                } else if (msg.payload.match(/^\s*$/)) {
                    result.isError = true;
                    result.message = RED._("node-line-bot-broadcast-message.errors.messageEmpty");
                }
            } else if (msg.messageType === 1) {
                if (typeof msg.payload !== 'object') {
                    result.isError = true;
                    result.message = RED._("node-line-bot-broadcast-message.errors.messageInvalid");
                }
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-bot-broadcast-message.errors.messageRequired");
        }

        return result;
    }
    function NodeLineBotBroadcastMessage(config) {
        RED.nodes.createNode(this, config);
        this.channelAccessToken = this.credentials.token;
        this.useExternalMessage = config.useExternalMessage;
        this.messageType = parseInt(config.messageType);  // 0 = normal message, 1 = custom whole message JSON format
        this.message = config.message;
        this.disabledNotification = config.disabledNotification;
        this.jsonMsg = {};
        let node = this;

        node.on('input', async (msg) => {
            if (!node.channelAccessToken) {
                msg.payload = RED._("node-line-bot-broadcast-message.errors.notFoundToken");
                msg.status = -1;
                setError(node, msg);
                return;
            } else {
                if (node.useExternalMessage) {  // if use external message
                    // validate external message data
                    let result = validateExternalMessage(msg);
                    if (result.isError) {   // if external data has error
                        msg.payload = result.message;
                        msg.status = -1;
                        setError(node, msg);
                        return;
                    } else {    // if external data does not has error -> map data
                        node.messageType = msg.messageType;
                        if (msg.messageType === 0) {
                            node.message = msg.payload;
                        } else if (msg.messageType === 1) {
                            node.jsonMsg = msg.payload;
                        }
                    }
                } else {
                    if (node.messageType === 1) {   // if messageType = custom whole message JSON format
                        // convert string to JSON
                        node.jsonMsg = JSON.parse(node.message);
                    }
                }
                // Initiate client object
                const client = new lineBot.Client({
                    channelAccessToken: node.channelAccessToken
                });
                try {
                    let res;
                    if (node.messageType === 0) {   // 0 = normal text message
                        res = await client.broadcast({
                            type: 'text',
                            text: node.message,
                            notificationDisabled: node.disabledNotification
                        });
                    } else if (node.messageType === 1) {    // 1 = custom whole message JSON format
                        res = await client.broadcast(node.jsonMsg, node.disabledNotification);
                    }
                    msg.status = 0;
                    msg.payload = RED._("node-line-bot-broadcast-message.send-result.success") + JSON.stringify(res);
                    node.send(msg);
                    node.status({ fill: "green", shape: "dot", text: "success" });
                } catch (error) {
                    msg.status = error.statusCode;
                    msg.payload = error.statusMessage;
                    setError(node, msg);
                }
            }
        });
    }

    RED.nodes.registerType("node-line-bot-broadcast-message", NodeLineBotBroadcastMessage, {
        credentials: {
            token: {
                type: "text",
                required: true
            }
        }
    });
}
