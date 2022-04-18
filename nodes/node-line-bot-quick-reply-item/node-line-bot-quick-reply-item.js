'use strict';
module.exports = function (RED) {
    const ACTION_MESSAGE = "message";
    const ACTION_POSTBACK = "postback";
    const ACTION_URI = "uri";
    const ACTION_DATETIMEPICKER = "datetimepicker";
    const DATETIME_MODE_DATETIME = "datetime";
    const DATETIME_MODE_DATE = "date";
    const DATETIME_MODE_TIME = "time";

    // Setting Error function
    function setError(node, message) {
        node.error(message);
        node.status({ fill: "red", shape: "ring", text: message.payload });
    }

    function convertDate(strDate) {
        const parts = strDate.split("/");
        return parts[2] + "-" + parts[1] + "-" + parts[0];
    }

    function NodeLineBotQuickReplyItem(config) {
        RED.nodes.createNode(this, config);
        this.action = config.action;
        this.imageUrl = config.imageUrl;
        this.replyLabel = config.replyLabel;
        this.postbackData = config.postbackData;
        this.postbackDisplayText = config.postbackDisplayText;
        this.messageText = config.messageText;
        this.uri = config.uri;
        this.altUriDesktop = config.altUriDesktop;
        this.datetimeData = config.datetimeData;
        this.datetimeMode = config.datetimeMode;
        this.datetimeInitialDate = config.datetimeInitialDate
        this.datetimeInitialTime = config.datetimeInitialTime
        this.datetimeMaxDate = config.datetimeMaxDate
        this.datetimeMaxTime = config.datetimeMaxTime
        this.datetimeMinDate = config.datetimeMinDate
        this.datetimeMinTime = config.datetimeMinTime
        this.useQuickReplyItem = config.useQuickReplyItem;

        let node = this;

        node.on('input', (msg) => {
            // if there is 'msg.useQuickReplyItem' send into node.
            if (typeof msg.useQuickReplyItem === 'boolean') {
                node.useQuickReplyItem = msg.useQuickReplyItem;
            }
            let quickReply = {};
            let action = {};
            let quickReplyItem = {};
            // set 'type'
            quickReply.type = "action";
            // set 'imageUrl'
            if (node.imageUrl !== "") {
                quickReply.imageUrl = node.imageUrl;
            }
            // assign 'action'
            action.type = node.action;
            action.label = node.replyLabel;
            if (node.action === ACTION_POSTBACK) {   // postbaack
                action.data = node.postbackData;
                action.displayText = node.postbackDisplayText;
            } else if (node.action === ACTION_MESSAGE) {    // message
                action.text = node.messageText;
            } else if (node.action === ACTION_URI) { // uri
                action.uri = node.uri;
                if (node.altUriDesktop !== "") {
                    action.altUri.desktop = node.altUriDesktop;
                }
            } else if (node.action === ACTION_DATETIMEPICKER) { // datetimepicker
                action.data = node.datetimeData;
                action.mode = node.datetimeMode;
                if (node.datetimeMode === DATETIME_MODE_DATETIME) { // mode 'datetime'
                    // Map both date and time
                    // Initial
                    if (node.datetimeInitialDate !== "" && node.datetimeInitialTime !== "") {
                        action.initial = convertDate(node.datetimeInitialDate) + "T" + node.datetimeInitialTime;
                    } else if ((node.datetimeInitialDate !== "" && node.datetimeInitialTime === "") ||
                        (node.datetimeInitialDate === "" && node.datetimeInitialTime !== "")) {
                        // raise error
                        msg.payload = RED._("node-line-bot-quick-reply-item.errors.errorMapInitialDatetime");
                        msg.status = -1;
                        setError(node, msg);
                        return;
                    }
                    // Max
                    if (node.datetimeMaxDate !== "" && node.datetimeMaxTime !== "") {
                        action.max = convertDate(node.datetimeMaxDate) + "T" + node.datetimeMaxTime;
                    } else if ((node.datetimeMaxDate !== "" && node.datetimeMaxTime === "") ||
                        (node.datetimeMaxDate === "" && node.datetimeMaxTime !== "")) {
                        // raise error
                        msg.payload = RED._("node-line-bot-quick-reply-item.errors.errorMapMaxDatetime");
                        msg.status = -1;
                        setError(node, msg);
                        return;
                    }
                    // Min
                    if (node.datetimeMinDate !== "" && node.datetimeMinTime !== "") {
                        action.min = convertDate(node.datetimeMinDate) + "T" + node.datetimeMinTime;
                    } else if ((node.datetimeMinDate !== "" && node.datetimeMinTime === "") ||
                        (node.datetimeMinDate === "" && node.datetimeMinTime !== "")) {
                        // raise error
                        msg.payload = RED._("node-line-bot-quick-reply-item.errors.errorMapMinDatetime");
                        msg.status = -1;
                        setError(node, msg);
                        return;
                    }
                } else if (node.datetimeMode === DATETIME_MODE_DATE) {
                    // Map only date
                    if (node.datetimeInitialDate !== "") {
                        action.initial = convertDate(node.datetimeInitialDate);
                    }
                    if (node.datetimeMaxDate !== "") {
                        action.max = convertDate(node.datetimeMaxDate);
                    }
                    if (node.datetimeMinDate !== "") {
                        action.min = convertDate(node.datetimeMinDate);
                    }
                } else if (node.datetimeMode === DATETIME_MODE_TIME) {
                    // Map only time
                    if (node.datetimeInitialTime !== "") {
                        action.initial = node.datetimeInitialTime;
                    }
                    if (node.datetimeMaxTime !== "") {
                        action.max = node.datetimeMaxTime;
                    }
                    if (node.datetimeMinTime !== "") {
                        action.min = node.datetimeMinTime;
                    }
                }
            }
            // Set 'action'
            quickReply.action = action;
            // Pack QuickReply Item
            quickReplyItem.item = quickReply;
            quickReplyItem.useQuickReplyItem = node.useQuickReplyItem;
            // Set 'quickReplyItem'
            msg.quickReplyItem = quickReplyItem;
            node.send(msg);
            node.status({});
        });
    }
    RED.nodes.registerType("node-line-bot-quick-reply-item", NodeLineBotQuickReplyItem);
}
