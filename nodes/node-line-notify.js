'use strict';
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const BASE_URL = 'https://notify-api.line.me';
const PATH =  '/api/notify';

module.exports = function (RED) {
    // Setting Error function
    function setError(node, message) {
        node.error(message);
        node.status({ fill: "red", shape: "ring", text: message.payload});
    }
    // Validate External Data function
    function validateExternalData(msg) {
        let result = {
            isError: false,
            message: ""
        };
        // validate message
        if (typeof msg.message !== 'undefined') {
            if (typeof msg.message !== 'string') {
                result.isError = true;
                result.message = RED._("node-line-notify.errors.messageInvalid");
                
            } else if (msg.message.match(/^\s*$/)) {
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
            result.isError = true;
            result.message = RED._("node-line-notify.errors.useImageUrlRequired");
        }
        if (result.isError) {
            return result;
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
            result.isError = true;
            result.message = RED._("node-line-notify.errors.useImageFileRequired");
        }
        if (result.isError) {
            return result;
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
            result.isError = true;
            result.message = RED._("node-line-notify.errors.useStickerRequired");
        }
        if (result.isError) {
            return result;
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
                        formLineNotify.append("message", msg.message);
                        if (msg.useImageUrl) {
                            formLineNotify.append("imageFullsize", msg.imageFullsizeUrl);
                            formLineNotify.append("imageThumbnail", msg.imageThumbnailUrl);
                        }
                        if (msg.useImageFile) {
                            formLineNotify.append("imageFile", fs.createReadStream(msg.imageFile));
                        }
                        if (msg.useSticker) {
                            formLineNotify.append("stickerPackageId", msg.stickerPackageId);
                            formLineNotify.append("stickerId", msg.stickerId);
                        }
                    }
                } else {    // use internal data
                    formLineNotify.append("message", node.message);
                    if (node.useImageUrl) {
                        formLineNotify.append("imageFullsize", node.imageFullsizeUrl);
                        formLineNotify.append("imageThumbnail", node.imageThumbnailUrl);
                    }
                    if (node.useImageFile) {
                        formLineNotify.append("imageFile", fs.createReadStream(node.imageFile));
                    }
                    if (node.useSticker) {
                        formLineNotify.append("stickerPackageId", node.lineStickerPackageId);
                        formLineNotify.append("stickerId", node.lineStickerId);
                    }
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
                    msg.payload = RED._("node-line-notify.send-result.success");
                    node.send(msg);
                    node.status({fill: "green", shape: "dot", text: "success"});
                })
                .catch((error) => {
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
                type:"text"
            }
        }
    });
}