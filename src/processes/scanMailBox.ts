import { Mail, MailboxConfig } from "../types";
import { getInbox } from "../utils/getInbox";

async function processEmails(
  mail_box_config: MailboxConfig,
  repliedEmails: string[],
  started_at: number
) {
  const repliedMap = new Map<string, string>();
  const emails: Mail[] = await getInbox(mail_box_config);
  console.log(emails);
  for (const email of emails) {
    // console.log(email);
    // console.log("\n\n\n");
    const received_date = email.date;
    const date = new Date(received_date);
    const received_date_epoch = Math.floor(date.getTime() / 1000);

    if (received_date_epoch <= started_at) return;
    const emailId = email.from;
    const replyTime = new Date().toISOString();

    if (!repliedMap.has(received_date)) {
      sendMail(email);
      repliedEmails.push(received_date);
      console.log(`Replied to email from ${emailId} at ${replyTime}`);
    }
  }
}

export const processEmail_PROCESS = async () => {
  const date = new Date();
  const time_now_epoch = Math.floor(date.getTime() / 1000);
  setInterval(() => {
    const email_id_array = [
      {
        config: {
          user: "support@auxaty.com",
          password: "Auxaty@500",
          host: "imap.hostinger.com", // Replace with your webmail IMAP server
          port: 993,
          tls: true,
          tlsOptions: { rejectUnauthorized: false },
        },
        process_started_at: time_now_epoch,
      },
    ];
    for (const email of email_id_array) {
      const replied_emails: any = [];
      processEmails(email.config, replied_emails, email.process_started_at);
    }
  }, 0.0005 * 60 * 1000);
};
