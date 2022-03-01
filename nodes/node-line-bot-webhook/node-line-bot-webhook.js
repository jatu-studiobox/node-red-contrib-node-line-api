/**
 * This project is in compliance under the Apache License, Version 2.0
 * Reference to base code
 * https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/nodes/core/network/21-httpin.js
 */

module.exports = function (RED) {
    "use strict";
    const bodyParser = require("body-parser");
    const multer = require("multer");
    const cookieParser = require("cookie-parser");
    const getBody = require('raw-body');
    const cors = require('cors');
    const onHeaders = require('on-headers');
    const typer = require('content-type');
    const mediaTyper = require('media-typer');
    const isUtf8 = require('is-utf8');
    const hashSum = require("hash-sum");
    const crypto = require('crypto');

    function rawBodyParser(req, res, next) {
        if (req.skipRawBodyParser) { next(); } // don't parse this if told to skip
        if (req._body) { return next(); }
        req.body = "";
        req._body = true;

        var isText = true;
        var checkUTF = false;

        if (req.headers['content-type']) {
            var contentType = typer.parse(req.headers['content-type'])
            if (contentType.type) {
                var parsedType = mediaTyper.parse(contentType.type);
                if (parsedType.type === "text") {
                    isText = true;
                } else if (parsedType.subtype === "xml" || parsedType.suffix === "xml") {
                    isText = true;
                } else if (parsedType.type !== "application") {
                    isText = false;
                } else if ((parsedType.subtype !== "octet-stream")
                    && (parsedType.subtype !== "cbor")
                    && (parsedType.subtype !== "x-protobuf")) {
                    checkUTF = true;
                } else {
                    // application/octet-stream or application/cbor
                    isText = false;
                }

            }
        }

        getBody(req, {
            length: req.headers['content-length'],
            encoding: isText ? "utf8" : null
        }, function (err, buf) {
            if (err) { return next(err); }
            if (!isText && checkUTF && isUtf8(buf)) {
                buf = buf.toString()
            }
            req.body = buf;
            next();
        });
    }

    var corsSetup = false;

    function createRequestWrapper(node, req) {
        // This misses a bunch of properties (eg headers). Before we use this function
        // need to ensure it captures everything documented by Express and HTTP modules.
        var wrapper = {
            _req: req
        };
        var toWrap = [
            "param",
            "get",
            "is",
            "acceptsCharset",
            "acceptsLanguage",
            "app",
            "baseUrl",
            "body",
            "cookies",
            "fresh",
            "hostname",
            "ip",
            "ips",
            "originalUrl",
            "params",
            "path",
            "protocol",
            "query",
            "route",
            "secure",
            "signedCookies",
            "stale",
            "subdomains",
            "xhr",
            "socket" // TODO: tidy this up
        ];
        toWrap.forEach(function (f) {
            if (typeof req[f] === "function") {
                wrapper[f] = function () {
                    node.warn(RED._("node-line-bot-webhook.errors.deprecated-call", { method: "msg.req." + f }));
                    var result = req[f].apply(req, arguments);
                    if (result === req) {
                        return wrapper;
                    } else {
                        return result;
                    }
                }
            } else {
                wrapper[f] = req[f];
            }
        });
        return wrapper;
    }
    function createResponseWrapper(node, res) {
        var wrapper = {
            _res: res
        };
        var toWrap = [
            "append",
            "attachment",
            "cookie",
            "clearCookie",
            "download",
            "end",
            "format",
            "get",
            "json",
            "jsonp",
            "links",
            "location",
            "redirect",
            "render",
            "send",
            "sendfile",
            "sendFile",
            "sendStatus",
            "set",
            "status",
            "type",
            "vary"
        ];
        toWrap.forEach(function (f) {
            wrapper[f] = function () {
                node.warn(RED._("node-line-bot-webhook.errors.deprecated-call", { method: "msg.res." + f }));
                var result = res[f].apply(res, arguments);
                if (result === res) {
                    return wrapper;
                } else {
                    return result;
                }
            }
        });
        return wrapper;
    }

    var corsHandler = function (req, res, next) { next(); }

    if (RED.settings.httpNodeCors) {
        corsHandler = cors(RED.settings.httpNodeCors);
        RED.httpNode.options("*", corsHandler);
    }

    
    function checkSecure(channelSecret, req) {
        const secretHeader = req.headers['x-line-signature'];
        console.log('secretHeader: ', secretHeader);
        const body = req.body; // Request body string
        const signature = crypto
            .createHmac('SHA256', channelSecret)
            .update(JSON.stringify(body)).digest('base64');
        // Compare x-line-signature request header and the signature
        console.log('signature: ', signature);
        return secretHeader === signature;
    }

    function NodeLineBotWebhook(n) {
        RED.nodes.createNode(this, n);
        if (RED.settings.httpNodeRoot !== false) {
            this.channelSecret = this.credentials.secret;
            if (!n.webhookUrl) {
                this.warn(RED._("node-line-bot-webhook.errors.missing-path"));
                return;
            }
            if (!this.channelSecret) {
                this.warn(RED._("node-line-bot-webhook.errors.notFoundSecret"));
                return;
            }
            this.webhookUrl = n.webhookUrl;
            if (this.webhookUrl[0] !== '/') {
                this.webhookUrl = '/' + this.webhookUrl;
            }
            this.upload = false;
            var node = this;

            this.errorHandler = function (err, req, res, next) {
                node.warn(err);
                res.sendStatus(500);
            };

            this.callback = function (req, res) {
                let resWraper = createResponseWrapper(node, res);
                // check Signature Security
                if (checkSecure(node.channelSecret, req)) {
                    console.log("secure pass");
                    var msgid = RED.util.generateId();
                    res._msgid = msgid;
                    node.send({
                        _msgid: msgid, 
                        req: req,
                        payload: req.body 
                    });
                    resWraper._res.set('content-length', 0);
                    resWraper._res.status(200).send('');
                } else {
                    console.log("secure fail");
                    resWraper._res.set('content-length', 0);
                    resWraper._res.status(401).send('');
                }
            };

            var httpMiddleware = function (req, res, next) { next(); }

            if (RED.settings.httpNodeMiddleware) {
                if (typeof RED.settings.httpNodeMiddleware === "function" || Array.isArray(RED.settings.httpNodeMiddleware)) {
                    httpMiddleware = RED.settings.httpNodeMiddleware;
                }
            }

            var maxApiRequestSize = RED.settings.apiMaxLength || '5mb';
            var jsonParser = bodyParser.json({ limit: maxApiRequestSize });
            var urlencParser = bodyParser.urlencoded({ limit: maxApiRequestSize, extended: true });

            var metricsHandler = function (req, res, next) { next(); }
            if (this.metric()) {
                metricsHandler = function (req, res, next) {
                    var startAt = process.hrtime();
                    onHeaders(res, function () {
                        if (res._msgid) {
                            var diff = process.hrtime(startAt);
                            var ms = diff[0] * 1e3 + diff[1] * 1e-6;
                            var metricResponseTime = ms.toFixed(3);
                            var metricContentLength = res.getHeader("content-length");
                            //assuming that _id has been set for res._metrics in HttpOut node!
                            node.metric("response.time.millis", { _msgid: res._msgid }, metricResponseTime);
                            node.metric("response.content-length.bytes", { _msgid: res._msgid }, metricContentLength);
                        }
                    });
                    next();
                };
            }

            var multipartParser = function (req, res, next) { next(); }
            if (this.upload) {
                var mp = multer({ storage: multer.memoryStorage() }).any();
                multipartParser = function (req, res, next) {
                    mp(req, res, function (err) {
                        req._body = true;
                        next(err);
                    })
                };
            }

            // Receive POST method only
            RED.httpNode.post(this.webhookUrl, cookieParser(), httpMiddleware, corsHandler, metricsHandler, jsonParser, urlencParser, multipartParser, rawBodyParser, this.callback, this.errorHandler);

            this.on("close", function () {
                var node = this;
                RED.httpNode._router.stack.forEach(function (route, i, routes) {
                    if (route.route && route.route.path === node.webhookUrl && route.route.methods["post"]) {
                        routes.splice(i, 1);
                    }
                });
            });
        } else {
            this.warn(RED._("node-line-bot-webhook.errors.not-created"));
        }
    }
    RED.nodes.registerType("node-line-bot-webhook", NodeLineBotWebhook, {
        credentials: {
            secret: {
                type: "text",
                required: true
            }
        }
    });
}