'use strict';
module.exports = function (RED) {
    function convertDate(strDate) {
        const parts = strDate.split("/");
        return parts[2] + "-" + parts[1] + "-" + parts[0];
    }

    function prepareDatetime(strDate, strTime) {
        if (strDate !== "" && strTime !== "") {
             return convertDate(strDate) + "T" + strTime;
        }
        if (strDate !== "" && strTime === "") {
            return convertDate(strDate);
        }
        if (strDate === "" && strTime !== "") {
            return strTime;
        }
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
            if (node.action === "postback") {   // postbaack
                action.data = node.postbackData;
                action.displayText = node.postbackDisplayText;
            } else if (node.action === "message") {    // message
                action.text = node.messageText;
            } else if (node.action === "uri") { // uri
                action.uri = node.uri;
                if (node.altUriDesktop !== "") {
                    action.altUri.desktop = node.altUriDesktop;
                }
            } else if (node.action === "datetimepicker") { // datetimepicker
                action.data = node.datetimeData;
                action.mode = node.datetimeMode;
                if (node.datetimeInitialDate !== "" || node.datetimeInitialTime !== "") {
                    action.initial = prepareDatetime(node.datetimeInitialDate, node.datetimeInitialTime);
                }
                if (node.datetimeMaxDate !== "" || node.datetimeMaxTime !== "") {
                    action.max = prepareDatetime(node.datetimeMaxDate, node.datetimeMaxTime);
                }
                if (node.datetimeMinDate !== "" || node.datetimeMinTime !== "") {
                    action.min = prepareDatetime(node.datetimeMinDate, node.datetimeMinTime);
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
        });
    }
    RED.nodes.registerType("node-line-bot-quick-reply-item", NodeLineBotQuickReplyItem);
}
