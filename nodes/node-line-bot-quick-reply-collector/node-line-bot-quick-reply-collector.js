/**
 * This project is in compliance under the Apache License, Version 2.0
 * Reference to base code
 https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/nodes/core/sequence/17-split.js
 **/
'use strict';
module.exports = function (RED) {
    function NodeLineBotQuickReplyCollector(n) {
        // mode = custom
        // build = array
        // property = quickReplyItem
        // propertyType = msg
        RED.nodes.createNode(this, n);
        this.mode = "custom";
        this.property = "quickReplyItem";
        this.propertyType = "msg";
        this.count = Number(n.count || 0);
        this.joiner = "";
        this.build = "array";

        let node = this;
        let inflight = {};

        const completeSend = (partId, msg) => {
            const group = inflight[partId];
            delete inflight[partId];
            RED.util.setMessageProperty(group.msg, node.property, group.payload);
            delete group.msg.parts;
            delete group.msg.complete;
            // Gathering Group message
            const groupMsg = RED.util.cloneMessage(group.msg);
            // Gathering quickReplyItem array in Group message
            const allItems = groupMsg.quickReplyItem;
            // filter check item only 'useQuickReplyItem' = true
            let quickReplyItems = [];
            allItems.forEach((eachItem) => {
                if (eachItem.useQuickReplyItem === true) {
                    return quickReplyItems.push(eachItem.item);
                }
            });
            msg.quickReplyItems = quickReplyItems;
            node.send(msg);
            // group.send(msg.quickReplyItems);
            group.dones.forEach(f => f());
            group.dones = [];
        }

        this.on("input", (msg, send, done) => {
            try {
                let property;
                let partId = "_";
                try {
                    property = RED.util.getMessageProperty(msg, node.property);
                } catch (err) {
                    node.warn("Message property " + node.property + " not found");
                    done();
                    return;
                }
                let payloadType;
                let targetCount;
                let arrayLen;

                // Use the node configuration to identify all of the group information
                payloadType = node.build;
                targetCount = node.count;

                if (!inflight.hasOwnProperty(partId)) {
                    inflight[partId] = {
                        currentCount: 0,
                        payload: [],
                        targetCount: targetCount,
                        type: payloadType,
                        msg: RED.util.cloneMessage(msg),
                        send: send,
                        dones: []
                    };
                    inflight[partId].arrayLen = arrayLen;
                }
                inflight[partId].dones.push(done);

                let group = inflight[partId];
                if (property !== undefined) {
                    group.payload.push(property);
                    group.currentCount++;
                }

                group.msg = Object.assign(group.msg, msg);
                group.send = send;
                const tcnt = group.targetCount;

                if ((tcnt > 0 && group.currentCount >= tcnt) || msg.hasOwnProperty('complete')) {
                    completeSend(partId, msg);
                }
            }
            catch (err) {
                done(err);
                console.log(err.stack);
            }
        });

        this.on("close", function () {
            for (let i in inflight) {
                if (inflight.hasOwnProperty(i)) {
                    clearTimeout(inflight[i].timeout);
                    inflight[i].dones.forEach(d => d());
                }
            }
        });
    }
    RED.nodes.registerType("node-line-bot-quick-reply-collector", NodeLineBotQuickReplyCollector);
}