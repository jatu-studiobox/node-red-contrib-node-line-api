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
                result.message = RED._("node-line-bot-reply-message.errors.messageTypeInvalid");
            } else if (!Number.isInteger(msg.messageType)) {
                result.isError = true;
                result.message = RED._("node-line-bot-reply-message.errors.messageTypeInvalid");
            } else if (!(msg.messageType === 0 || msg.messageType === 1)) {  // 0 = normal message, 1 = custom whole message JSON format
                result.isError = true;
                result.message = RED._("node-line-bot-reply-message.errors.messageTypeInvalid");
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-bot-reply-message.errors.messageTypeRequired");
        }
        if (result.isError) {
            return result;
        }
        // validate message section
        if (typeof msg.payload !== 'undefined') {
            if (msg.messageType === 0) {
                if (typeof msg.payload !== 'string') {
                    result.isError = true;
                    result.message = RED._("node-line-bot-reply-message.errors.messageInvalid");
                } else if (msg.payload.match(/^\s*$/)) {
                    result.isError = true;
                    result.message = RED._("node-line-bot-reply-message.errors.messageEmpty");
                }
            } else if (msg.messageType === 1) {
                if (typeof msg.payload !== 'object') {
                    result.isError = true;
                    result.message = RED._("node-line-bot-reply-message.errors.messageInvalid");
                }
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-bot-reply-message.errors.messageRequired");
        }
        return result;
    }
    // Validate External Destination Id function
    function validateExternalReplyToken(msg) {
        let result = {
            isError: false,
            message: ""
        };
        // validate message
        if (typeof msg.replyToken !== 'undefined') {
            if (typeof msg.replyToken !== 'string') {
                result.isError = true;
                result.message = RED._("node-line-bot-reply-message.errors.replyTokenInvalid");

            } else if (msg.replyToken.match(/^\s*$/)) {
                result.isError = true;
                result.message = RED._("node-line-bot-reply-message.errors.replyTokenEmpty");
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-bot-reply-message.errors.replyTokenRequired");
        }
        return result;
    }

    function NodeLineBotReplyMessage(config) {
        RED.nodes.createNode(this, config);
        this.useExternalMessage = config.useExternalMessage;
        this.useExternalReplyToken = config.useExternalReplyToken;
        this.replyToken = this.credentials.replyToken;
        this.messageType = parseInt(config.messageType);  // 0 = normal message, 1 = custom whole message JSON format
        this.message = config.message;
        this.disabledNotification = config.disabledNotification;
        this.jsonMsg = {};
        // Retrieve the config node
        this.apiConfig = RED.nodes.getNode(config.apiConfig);
        this.channelAccessToken = this.apiConfig.credentials.token;
        let node = this;

        node.on('input', async (msg) => {
            if (!node.channelAccessToken) {
                msg.payload = RED._("node-line-bot-reply-message.errors.notFoundToken");
                msg.status = -1;
                setError(node, msg);
                return;
            }
            if (node.useExternalReplyToken) {    // if use external destination ID
                // validate external destinatin id data
                const result = validateExternalReplyToken(msg);
                if (result.isError) {   // if external data has error
                    msg.payload = result.message;
                    msg.status = -1;
                    setError(node, msg);
                    return;
                } else {    // if external destination Id does not has error -> map data
                    node.replyToken = msg.replyToken;
                }
            } else {    // use internal destination ID
                // check Destination ID
                if (node.replyToken.match(/^\s*$/)) {
                    msg.payload = RED._("node-line-bot-reply-message.errors.replyTokenEmpty");
                    msg.status = -1;
                    setError(node, msg);
                    return;
                }
            }
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
                    res = await client.replyMessage(node.replyToken, {
                        type: 'text',
                        text: node.message,
                        notificationDisabled: node.disabledNotification
                    });
                } else if (node.messageType === 1) {    // 1 = custom whole message JSON format
                    res = await client.replyMessage(node.replyToken, node.jsonMsg, node.disabledNotification);
                }
                msg.status = 0;
                msg.payload = RED._("node-line-bot-reply-message.send-result.success") + JSON.stringify(res);
                node.send(msg);
                node.status({ fill: "green", shape: "dot", text: "success" });
            } catch (error) {
                msg.status = error.statusCode;
                msg.payload = error.statusMessage;
                setError(node, msg);
            }
        });
    }

    RED.nodes.registerType("node-line-bot-reply-message", NodeLineBotReplyMessage, {
        credentials: {
            replyToken: {
                type: "text",
                required: true
            }
        }
    });
}