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
                result.message = RED._("node-line-bot-push-message.errors.messageTypeInvalid");
            } else if (!Number.isInteger(msg.messageType)) {
                result.isError = true;
                result.message = RED._("node-line-bot-push-message.errors.messageTypeInvalid");
            } else if (!(msg.messageType === 0 || msg.messageType === 1)) {  // 0 = normal message, 1 = custom whole message JSON format
                result.isError = true;
                result.message = RED._("node-line-bot-push-message.errors.messageTypeInvalid");
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-bot-push-message.errors.messageTypeRequired");
        }
        if (result.isError) {
            return result;
        }
        // validate message section
        if (typeof msg.payload !== 'undefined') {
            if (msg.messageType === 0) {
                if (typeof msg.payload !== 'string') {
                    result.isError = true;
                    result.message = RED._("node-line-bot-push-message.errors.messageInvalid");
                } else if (msg.payload.match(/^\s*$/)) {
                    result.isError = true;
                    result.message = RED._("node-line-bot-push-message.errors.messageEmpty");
                }
            } else if (msg.messageType === 1) {
                if (typeof msg.payload !== 'object') {
                    result.isError = true;
                    result.message = RED._("node-line-bot-push-message.errors.messageInvalid");
                }
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-bot-push-message.errors.messageRequired");
        }
        return result;
    }
    // Validate External Destination Id function
    function validateExternalDestinationId(msg) {
        let result = {
            isError: false,
            message: ""
        };
        // validate message
        if (typeof msg.destinationId !== 'undefined') {
            if (typeof msg.destinationId !== 'string') {
                result.isError = true;
                result.message = RED._("node-line-bot-push-message.errors.destinationIdInvalid");

            } else if (msg.destinationId.match(/^\s*$/)) {
                result.isError = true;
                result.message = RED._("node-line-bot-push-message.errors.destinationIdEmpty");
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-bot-push-message.errors.destinationIdRequired");
        }
        return result;
    }

    function NodeLineBotPushMessage(config) {
        RED.nodes.createNode(this, config);
        this.useExternalMessage = config.useExternalMessage;
        this.useExternalDestinationId = config.useExternalDestinationId;
        this.destinationId = this.credentials.destinationId;
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
                msg.payload = RED._("node-line-bot-push-message.errors.notFoundToken");
                msg.status = -1;
                setError(node, msg);
                return;
            }
            if (node.useExternalDestinationId) {    // if use external destination ID
                // validate external destinatin id data
                const result = validateExternalDestinationId(msg);
                if (result.isError) {   // if external data has error
                    msg.payload = result.message;
                    msg.status = -1;
                    setError(node, msg);
                    return;
                } else {    // if external destination Id does not has error -> map data
                    node.destinationId = msg.destinationId;
                }
            } else {    // use internal destination ID
                // check Destination ID
                if (node.destinationId.match(/^\s*$/)) {
                    msg.payload = RED._("node-line-bot-push-message.errors.destinationIdEmpty");
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
            // Add Quick Reply feature
            let quickReplyItems = [];
            try {
                if (msg.quickReplyItems) {
                    if (msg.quickReplyItems.length > 0) {
                        quickReplyItems = msg.quickReplyItems;
                        console.log("quickReplyItems: ", quickReplyItems);
                    }
                }
            } catch (error) {
                msg.status = -1;
                msg.payload = "Error using Quick Reply";
                setError(node, msg);
                return;
            }

            // Initiate client object
            const client = new lineBot.Client({
                channelAccessToken: node.channelAccessToken
            });
            try {
                let res;
                if (node.messageType === 0) {   // 0 = normal text 
                    // Prepare payload message
                    let payloadMessage = {
                        type: 'text',
                        text: node.message
                    };
                    // If has any quick reply items, then map quick reply to payload message
                    if (quickReplyItems.length > 0) {
                        let quickReply = {
                            items: []
                        }
                        quickReply.items = quickReplyItems;
                        payloadMessage.quickReply = quickReply;
                    }
                    res = await client.pushMessage(node.destinationId, payloadMessage, node.disabledNotification);
                } else if (node.messageType === 1) {    // 1 = custom whole message JSON format
                    // If has any quick reply items, then map quick reply to payload message
                    if (quickReplyItems.length > 0) {
                        let quickReply = {
                            items: []
                        }
                        quickReply.items = quickReplyItems;
                        node.jsonMsg.quickReply = quickReply;
                    }
                    res = await client.pushMessage(node.destinationId, node.jsonMsg, node.disabledNotification);
                }
                msg.status = 0;
                msg.payload = RED._("node-line-bot-push-message.send-result.success") + JSON.stringify(res);
                node.send(msg);
                node.status({ fill: "green", shape: "dot", text: "success" });
            } catch (error) {
                msg.status = error.statusCode;
                msg.payload = error.statusMessage;
                setError(node, msg);
            }
        });
    }

    RED.nodes.registerType("node-line-bot-push-message", NodeLineBotPushMessage, {
        credentials: {
            destinationId: {
                type: "text",
                required: true
            }
        }
    });
}
