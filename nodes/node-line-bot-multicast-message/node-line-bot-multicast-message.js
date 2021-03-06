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
                result.message = RED._("node-line-bot-multicast-message.errors.messageTypeInvalid");
            } else if (!Number.isInteger(msg.messageType)) {
                result.isError = true;
                result.message = RED._("node-line-bot-multicast-message.errors.messageTypeInvalid");
            } else if (!(msg.messageType === 0 || msg.messageType === 1)) {  // 0 = normal message, 1 = custom whole message JSON format
                result.isError = true;
                result.message = RED._("node-line-bot-multicast-message.errors.messageTypeInvalid");
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-bot-multicast-message.errors.messageTypeRequired");
        }
        if (result.isError) {
            return result;
        }
        // validate message section
        if (typeof msg.payload !== 'undefined') {
            if (msg.messageType === 0) {
                if (typeof msg.payload !== 'string') {
                    result.isError = true;
                    result.message = RED._("node-line-bot-multicast-message.errors.messageInvalid");
                } else if (msg.payload.match(/^\s*$/)) {
                    result.isError = true;
                    result.message = RED._("node-line-bot-multicast-message.errors.messageEmpty");
                }
            } else if (msg.messageType === 1) {
                if (typeof msg.payload !== 'object') {
                    result.isError = true;
                    result.message = RED._("node-line-bot-multicast-message.errors.messageInvalid");
                }
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-bot-multicast-message.errors.messageRequired");
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
        if (typeof msg.destinations !== 'undefined') {
            // check destinations is array
            if (!Array.isArray(msg.destinations)) {
                result.isError = true;
                result.message = RED._("node-line-bot-multicast-message.errors.destinationsInvalid");
            } else {
                if (msg.destinations.length === 0) {
                    result.isError = true;
                    result.message = RED._("node-line-bot-multicast-message.errors.destinationsEmpty");
                } else {
                    // check Array members are all string
                    let itemIsNotString = false;
                    msg.destinations.forEach(function (item) {
                        if (typeof item !== 'string') {
                            itemIsNotString = true;
                        }
                    });
                    // if some items are not string
                    if (itemIsNotString) {
                        result.isError = true;
                        result.message = RED._("node-line-bot-multicast-message.errors.destinationsInvalid");
                    } else {
                        // check all items must have value (not empty)
                        let itemIsEmpty = false;
                        msg.destinations.forEach(function (item) {
                            if (item.match(/^\s*$/)) {
                                itemIsEmpty = true;
                            }
                        });
                        // if some items are empty
                        if (itemIsEmpty) {
                            result.isError = true;
                            result.message = RED._("node-line-bot-multicast-message.errors.destinationsItemEmpty");
                        }
                    }
                }
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-bot-multicast-message.errors.destinationsRequired");
        }
        return result;
    }

    function NodeLineBotMulticastMessage(config) {
        RED.nodes.createNode(this, config);
        this.useExternalMessage = config.useExternalMessage;
        this.useExternalDestinationId = config.useExternalDestinationId;
        this.destIdList = this.credentials.destIdList;
        this.messageType = parseInt(config.messageType);  // 0 = normal message, 1 = custom whole message JSON format
        this.message = config.message;
        this.disabledNotification = config.disabledNotification;
        this.jsonMsg = {};
        this.arrDestinationId = [];
        // Retrieve the config node
        this.apiConfig = RED.nodes.getNode(config.apiConfig);
        this.channelAccessToken = this.apiConfig.credentials.token;
        let node = this;

        node.on('input', async (msg) => {
            if (!node.channelAccessToken) {
                msg.payload = RED._("node-line-bot-multicast-message.errors.notFoundToken");
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
                    this.arrDestinationId = msg.destinations;
                }
            } else {    // use internal destination ID List
                // check Destination ID List
                if (typeof node.destIdList === 'undefined' || node.destIdList.match(/^\s*$/)) {
                    msg.payload = RED._("node-line-bot-multicast-message.errors.destinationIdEmpty");
                    msg.status = -1;
                    setError(node, msg);
                    return;
                } else {
                    this.arrDestinationId = node.destIdList.split(",");
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
                if (node.messageType === 0) {   // 0 = normal text message
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
                    res = await client.multicast(node.arrDestinationId, payloadMessage, node.disabledNotification);
                } else if (node.messageType === 1) {    // 1 = custom whole message JSON format
                    // If has any quick reply items, then map quick reply to payload message
                    if (quickReplyItems.length > 0) {
                        let quickReply = {
                            items: []
                        }
                        quickReply.items = quickReplyItems;
                        node.jsonMsg.quickReply = quickReply;
                    }
                    res = await client.multicast(node.arrDestinationId, node.jsonMsg, node.disabledNotification);
                }
                msg.status = 0;
                msg.payload = RED._("node-line-bot-multicast-message.send-result.success") + JSON.stringify(res);
                node.send(msg);
                node.status({ fill: "green", shape: "dot", text: "success" });
            } catch (error) {
                msg.status = error.statusCode;
                msg.payload = error.statusMessage;
                setError(node, msg);
            }
        });
    }

    RED.nodes.registerType("node-line-bot-multicast-message", NodeLineBotMulticastMessage, {
        credentials: {
            destIdList: {
                type: "text",
                required: false
            }
        }
    });
}
