"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanMailBox_WS = scanMailBox_WS;
const Imap = require("imap");
const { simpleParser } = require("mailparser");
function scanMailBox_WS(mailboxConfig, process_mail) {
    const imap = new Imap(mailboxConfig);
    let isMonitoring = false;
    function openInbox(cb) {
        imap.openBox("INBOX", false, cb);
    }
    function startMonitoring() {
        if (isMonitoring)
            return;
        imap.on("mail", function (numNewMsgs) {
            console.log(`Received ${numNewMsgs} new message(s)`);
            const fetch = imap.seq.fetch(`${imap._box.messages.total - numNewMsgs + 1}:*`, { bodies: "", struct: true });
            fetch.on("message", function (msg, seqno) {
                msg.on("body", function (stream, info) {
                    let buffer = "";
                    stream.on("data", function (chunk) {
                        buffer += chunk.toString("utf8");
                    });
                    stream.once("end", function () {
                        // Parse the email
                        simpleParser(buffer, (err, mail) => {
                            var _a;
                            if (err) {
                                console.error("Error parsing email:", err);
                                return;
                            }
                            const sender = ((_a = mail.from) === null || _a === void 0 ? void 0 : _a.text) || "Unknown Sender";
                            const timestamp = mail.date || new Date();
                            const body = mail.text || "";
                            process_mail(sender, timestamp, body);
                        });
                    });
                });
            });
            fetch.once("error", function (err) {
                console.error("Fetch error:", err);
            });
        });
        isMonitoring = true;
    }
    imap.once("ready", function () {
        openInbox(function (err, box) {
            if (err) {
                console.error("Error opening inbox:", err);
                return;
            }
            console.log("Inbox opened, monitoring for new emails...");
            startMonitoring();
        });
    });
    imap.once("error", function (err) {
        console.error("IMAP connection error:", err);
        setTimeout(() => {
            //@ts-ignore
            if (!imap.state === "disconnected") {
                console.log("Attempting to reconnect...");
                imap.connect();
            }
        }, 10000);
    });
    imap.on("end", function () {
        console.log("IMAP connection ended");
        isMonitoring = false;
        setTimeout(() => {
            console.log("Attempting to reconnect...");
            imap.connect();
        }, 10000);
    });
    imap.connect();
}
