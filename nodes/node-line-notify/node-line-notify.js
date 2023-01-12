'use strict';
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
const fs = require("fs");
const BASE_URL = 'https://notify-api.line.me';
const PATH = '/api/notify';

module.exports = function (RED) {
    // Setting Error function
    function setError(node, message) {
        node.error(message);
        node.status({ fill: "red", shape: "ring", text: message.payload });
    }
    // Validate External Data function
    function validateExternalData(msg) {
        let result = {
            isError: false,
            message: ""
        };
        // validate message
        if (typeof msg.payload !== 'undefined') {
            if (typeof msg.payload !== 'string') {
                result.isError = true;
                result.message = RED._("node-line-notify.errors.messageInvalid");

            } else if (msg.payload.match(/^\s*$/)) {
                result.isError = true;
                result.message = RED._("node-line-notify.errors.messageEmpty");
            }
        } else {
            result.isError = true;
            result.message = RED._("node-line-notify.errors.messageRequired");
        }
        if (result.isError) {
            return result;
        }
        // validate useImage
        if (typeof msg.useImageUrl !== 'undefined') {
            if (typeof msg.useImageUrl !== 'boolean') {
                result.isError = true;
                result.message = RED._("node-line-notify.errors.useImageUrlInvalid");
            }
        } else {
            // v0.6.0 -> not force to send but default to false
            msg.useImageUrl = false;
        }
        // if useImageUrl is true, then validate 'imageFullsizeUrl' and 'imageThumbnailUrl'
        if (msg.useImageUrl) {
            // validate imageFullsizeUrl
            if (typeof msg.imageFullsizeUrl !== 'undefined') {
                if (typeof msg.imageFullsizeUrl !== 'string') {
                    result.isError = true;
                    result.message = RED._("node-line-notify.errors.imageFullsizeUrlInvalid");
                } else if (msg.imageFullsizeUrl.length > 0 && !msg.imageFullsizeUrl.match(/(http[s]?:\/\/.*\.(?:jpg))/i)) {
                    result.isError = true;
                    result.message = RED._("node-line-notify.errors.imageFullsizeUrlInvalid");
                }
            } else {
                result.isError = true;
                result.message = RED._("node-line-notify.errors.imageFullsizeUrlRequired");
            }
            if (result.isError) {
                return result;
            }
            // validate imageThumbnailUrl
            if (typeof msg.imageThumbnailUrl !== 'undefined') {
                if (typeof msg.imageThumbnailUrl !== 'string') {
                    result.isError = true;
                    result.message = RED._("node-line-notify.errors.imageThumbnailUrlInvalid");
                } else if (msg.imageThumbnailUrl.length > 0 && !msg.imageThumbnailUrl.match(/(http[s]?:\/\/.*\.(?:jpg))/i)) {
                    result.isError = true;
                    result.message = RED._("node-line-notify.errors.imageThumbnailUrlInvalid");
                }
            } else {
                result.isError = true;
                result.message = RED._("node-line-notify.errors.imageThumbnailUrlRequired");
            }
            if (result.isError) {
                return result;
            }
        }
        // validate useImageFile
        if (typeof msg.useImageFile !== 'undefined') {
            if (typeof msg.useImageFile !== 'boolean') {
                result.isError = true;
                result.message = RED._("node-line-notify.errors.useImageFileInvalid");
            }
        } else {
            // v0.6.0 -> not force to send but default to false
            msg.useImageFile = false;
        }
        // if useImageFile is true, then validate 'imageFile'
        if (msg.useImageFile) {
            // validate imageFile
            if (typeof msg.imageFile !== 'undefined') {
                if (typeof msg.imageFile !== 'string') {
                    result.isError = true;
                    result.message = RED._("node-line-notify.errors.imageFileInvalid");
                } else if (msg.imageFile.length > 0 && !msg.imageFile.match(/^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}\[\]]+)+\.(png|jpg)$/i)) {
                    result.isError = true;
                    result.message = RED._("node-line-notify.errors.imageFileInvalid");
                }
            } else {
                result.isError = true;
                result.message = RED._("node-line-notify.errors.imageFileRequired");
            }
            if (result.isError) {
                return result;
            }
        }
        // validate useSticker
        if (typeof msg.useSticker !== 'undefined') {
            if (typeof msg.useSticker !== 'boolean') {
                result.isError = true;
                result.message = RED._("node-line-notify.errors.useStickerInvalid");
            }
        } else {
            // v0.6.0 -> not force to send but default to false
            msg.useSticker = false;
        }
        // if useSticker is true, then validate 'stickerPackageId' and 'stickerId'
        if (msg.useSticker) {
            // validate stickerPackageId
            if (typeof msg.stickerPackageId !== 'undefined') {
                if (typeof msg.stickerPackageId !== 'number') {
                    result.isError = true;
                    result.message = RED._("node-line-notify.errors.stickerPackageIdInvalid");
                } else if (!Number.isInteger(msg.stickerPackageId)) {
                    result.isError = true;
                    result.message = RED._("node-line-notify.errors.stickerPackageIdInvalid");
                }
            } else {
                result.isError = true;
                result.message = RED._("node-line-notify.errors.stickerPackageIdRequired");
            }
            if (result.isError) {
                return result;
            }
            // validate stickerId
            if (typeof msg.stickerId !== 'undefined') {
                if (typeof msg.stickerId !== 'number') {
                    result.isError = true;
                    result.message = RED._("node-line-notify.errors.stickerIdInvalid");
                } else if (!Number.isInteger(msg.stickerId)) {
                    result.isError = true;
                    result.message = RED._("node-line-notify.errors.stickerIdInvalid");
                }
            } else {
                result.isError = true;
                result.message = RED._("node-line-notify.errors.stickerIdRequired");
            }
            if (result.isError) {
                return result;
            }
        }
        return result;
    }
    function NodeLineNotify(config) {
        RED.nodes.createNode(this, config);
        this.accessToken = this.credentials.token;
        this.message = config.message;
        this.useExternalData = config.useExternalData;
        this.useImageUrl = config.useImageUrl;
        this.imageFullsizeUrl = config.imageFullsizeUrl;
        this.imageThumbnailUrl = config.imageThumbnailUrl;
        this.useImageFile = config.useImageFile;
        this.imageFile = config.imageFile;
        this.useSticker = config.useSticker;
        this.lineStickerPackageId = config.lineStickerPackageId;
        this.lineStickerId = config.lineStickerId;
        this.disabledPushNotification = config.disabledPushNotification;
        let node = this;
        let resultMessage = "";

        node.on('input', function (msg) {
            if (!node.accessToken) {
                msg.payload = RED._("node-line-notify.errors.notFoundToken");
                msg.status = -1;
                setError(node, msg);
                return;
            } else {
                const formLineNotify = new FormData();
                if (node.useExternalData) { // use external data
                    const result = validateExternalData(msg);   // validate external data
                    if (result.isError) {   // if external data has error
                        msg.payload = result.message;
                        msg.status = -1;
                        setError(node, msg);
                        return;
                    } else {    // if external data does not has error -> map data
                        formLineNotify.append("message", msg.payload);
                        if (msg.useImageUrl) {
                            formLineNotify.append("imageFullsize", msg.imageFullsizeUrl);
                            formLineNotify.append("imageThumbnail", msg.imageThumbnailUrl);
                        }
                        if (msg.useImageFile) {
                            if (fs.existsSync(msg.imageFile)) {
                                formLineNotify.append("imageFile", fs.createReadStream(msg.imageFile));
                            } else {
                                msg.payload = RED._("node-line-notify.errors.imgFileNotFound");
                                msg.status = -1;
                                setError(node, msg);
                                return;
                            }
                        }
                        if (msg.useSticker) {
                            formLineNotify.append("stickerPackageId", msg.stickerPackageId);
                            formLineNotify.append("stickerId", msg.stickerId);
                        }
                        resultMessage = msg.payload;
                    }
                } else {    // use internal data
                    formLineNotify.append("message", node.message);
                    if (node.useImageUrl) {
                        formLineNotify.append("imageFullsize", node.imageFullsizeUrl);
                        formLineNotify.append("imageThumbnail", node.imageThumbnailUrl);
                    }
                    if (node.useImageFile) {
                        if (fs.existsSync(node.imageFile)) {
                            formLineNotify.append("imageFile", fs.createReadStream(node.imageFile));
                        } else {
                            msg.payload = RED._("node-line-notify.errors.imgFileNotFound");
                            msg.status = -1;
                            setError(node, msg);
                            return;
                        }
                    }
                    if (node.useSticker) {
                        formLineNotify.append("stickerPackageId", node.lineStickerPackageId);
                        formLineNotify.append("stickerId", node.lineStickerId);
                    }
                    resultMessage = node.message;
                }
                if (node.disabledPushNotification) {
                    formLineNotify.append("notificationDisabled", true);
                }

                let lineConfig = {
                    url: BASE_URL + PATH,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + node.accessToken,
                        ...formLineNotify.getHeaders()
                    },
                    data: formLineNotify
                };
                axios(lineConfig).then((res) => {
                    msg.status = res.data.status;
                    msg.payload = RED._("node-line-notify.send-result.success") + resultMessage;
                    node.send(msg);
                    node.status({ fill: "green", shape: "dot", text: "success" });
                }).catch((error) => {
                    console.log(error);
                    msg.status = error.response.data.status;
                    msg.payload = error.response.data.message;
                    setError(node, msg);
                });
            }
        });
    }

    RED.nodes.registerType("node-line-notify", NodeLineNotify, {
        credentials: {
            token: {
                type: "text"
            }
        }
    });

    RED.httpAdmin.get('/emojiLabels', function(req, res) {
        res.json({
            "smile-people": RED._("node-line-notify.emoji-group-labels.smile-people"),
            "animal-nature": RED._("node-line-notify.emoji-group-labels.animal-nature"),
            "food-drink": RED._("node-line-notify.emoji-group-labels.food-drink"),
            "activity": RED._("node-line-notify.emoji-group-labels.activity"),
            "travel-places": RED._("node-line-notify.emoji-group-labels.travel-places"),
            "objects": RED._("node-line-notify.emoji-group-labels.objects"),
            "symbols": RED._("node-line-notify.emoji-group-labels.symbols"),
            "flags": RED._("node-line-notify.emoji-group-labels.flags")
        });
    });
}