import { MailboxConfig } from "../../types";

const Imap = require("imap");
const { simpleParser } = require("mailparser");

export function scanMailBox_WS(
  mailboxConfig: MailboxConfig,
  process_mail: (sender: string, timestamp: Date, body: string) => void
): void {
  const imap = new Imap(mailboxConfig);
  let isMonitoring = false;

  function openInbox(cb: any) {
    imap.openBox("INBOX", false, cb);
  }

  function startMonitoring() {
    if (isMonitoring) return;

    imap.on("mail", function (numNewMsgs: number) {
      console.log(`Received ${numNewMsgs} new message(s)`);

      const fetch = imap.seq.fetch(
        `${imap._box.messages.total - numNewMsgs + 1}:*`,
        { bodies: "", struct: true }
      );

      fetch.on("message", function (msg: any, seqno: any) {
        msg.on("body", function (stream: any, info: any) {
          let buffer = "";

          stream.on("data", function (chunk: any) {
            buffer += chunk.toString("utf8");
          });

          stream.once("end", function () {
            // Parse the email
            simpleParser(buffer, (err: any, mail: any) => {
              if (err) {
                console.error("Error parsing email:", err);
                return;
              }

              const sender = mail.from?.text || "Unknown Sender";
              const timestamp = mail.date || new Date();
              const body = mail.text || "";

              process_mail(sender, timestamp, body);
            });
          });
        });
      });

      fetch.once("error", function (err: any) {
        console.error("Fetch error:", err);
      });
    });

    isMonitoring = true;
  }

  imap.once("ready", function () {
    openInbox(function (err: any, box: any) {
      if (err) {
        console.error("Error opening inbox:", err);
        return;
      }

      console.log("Inbox opened, monitoring for new emails...");
      startMonitoring();
    });
  });

  imap.once("error", function (err: any) {
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
