import { MailboxConfig } from "../types";

const Imap = require("imap");
const { simpleParser } = require("mailparser");
const fs = require("fs");

// // Configure your email connection
// const imapConfig = {
//   user: "support@auxaty.com",
//   password: "Auxaty@500",
//   host: "imap.hostinger.com", // Replace with your webmail IMAP server
//   port: 993,
//   tls: true,
//   tlsOptions: { rejectUnauthorized: false },
// };

export function getInbox(mail_box_config: MailboxConfig): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const emails: any[] = [];

    // Create IMAP connection
    const imap = new Imap(mail_box_config);

    function openInbox(cb: any) {
      imap.openBox("INBOX", false, cb);
    }

    imap.once("ready", function () {
      openInbox(function (err: any, box: any) {
        if (err) {
          reject(err);
          return;
        }

        // Fetch ALL messages
        const fetchOptions = { bodies: "", struct: true };
        const fetch = imap.seq.fetch("1:*", fetchOptions);

        fetch.on("message", function (msg: any, seqno: any) {
          // console.log("Processing message #", seqno);

          msg.on("body", function (stream: any, info: any) {
            let buffer = "";

            stream.on("data", function (chunk: any) {
              buffer += chunk.toString("utf8");
            });

            stream.once("end", function () {
              // Parse the email
              simpleParser(buffer, (err: any, mail: any) => {
                if (err) {
                  console.error(err);
                  return;
                }

                // Add email to array - only essential fields, no HTML
                emails.push({
                  subject: mail.subject,
                  from: mail.from?.text,
                  date: mail.date,
                  text: mail.text,
                });

                // Optionally save to file (you can remove this if not needed)
                fs.appendFileSync(
                  "emails.txt",
                  `Subject: ${mail.subject}\n` +
                    `From: ${mail.from?.text}\n` +
                    `Date: ${mail.date}\n` +
                    `Body: ${mail.text}\n` +
                    "-".repeat(40) +
                    "\n"
                );
              });
            });
          });
        });

        fetch.once("error", function (err: any) {
          console.log("Fetch error: " + err);
          reject(err);
        });

        fetch.once("end", function () {
          // console.log("Done fetching all messages!");
          imap.end();
          resolve(emails);
        });
      });
    });

    imap.once("error", function (err: any) {
      console.log("IMAP connection error: " + err);
      reject(err);
    });

    imap.once("end", function () {
      console.log("IMAP connection ended");
    });

    // Start the connection
    imap.connect();
  });
}

// Export for use in other modules
