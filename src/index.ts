import { generateEmail } from "./ai/generatemail";
import { scanMailBox_WS } from "./utils/email/email-socket";
import { sendmail } from "./utils/email/send-mail";

console.log("Hello Wolrd");

const GROQ_API = "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"; // eample
const user = "support@auxaty.com"; // eample
const password = "Auxaty@500"; // eample
const host = "imap.hostinger.com"; // eample
const port = 993; // eample
const tls = true; // eample
const rejectUnauthorized = false; // eample
const host_SMTP = "smtp.hostinger.com"; // eample
const SMTP_PORT = 465; // eample
const name = "Auxaty"; // eample
// emails.txt

const mailboxConfig = {
  user,
  password,
  host,
  port,
  tls,
  tlsOptions: {
    rejectUnauthorized,
  },
};

const transport_config = {
  host: host_SMTP,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user,
    pass: password,
  },
};

const org_data = `Nexus AI: Bridging Intelligence, Empowering Innovation
Nexus AI is a pioneering artificial intelligence company at the forefront of creating intelligent systems that seamlessly connect people, data, and technology. Founded in 2021 by a team of visionary computer scientists and industry veterans, Nexus AI is dedicated to developing AI solutions that are not only powerful but also accessible, ethical, and human-centered.
Our Mission
At Nexus AI, we believe in creating a world where artificial intelligence serves as a nexus—a central connection point—between human creativity and computational power. Our mission is to develop AI technologies that augment human capabilities, solve complex problems, and drive positive transformation across industries.
Core Technologies

Adaptive Learning Systems: Our proprietary neural architecture adapts to unique datasets with minimal training, enabling faster deployment and more accurate results.
Multimodal Understanding: Nexus AI systems process and interpret text, images, audio, and video simultaneously, creating a more comprehensive understanding of complex information.
Ethical AI Framework: Built-in safeguards ensure our systems operate transparently, fairly, and with respect for privacy and human values.

Applications
Nexus AI develops solutions across healthcare, finance, education, and manufacturing, helping organizations automate routine tasks, uncover insights from complex data, and make more informed decisions.
Our Approach
What sets Nexus AI apart is our collaborative approach. We work closely with clients to understand their specific challenges and develop customized AI solutions that integrate seamlessly with existing workflows and systems.
Nexus AI: Where intelligence converges, possibilities emerge.`;

const user_prompt =
  "Answer all the mails very humbly and state yourself as the ultimate AI which works on behalf of customer care of Nexus AI.";

const process_mail = async (sender: string, timestamp: Date, body: string) => {
  console.log("Send started...");
  const { subject, body: text } = (
    await generateEmail(
      user_prompt,
      org_data,
      body,
      "qwen-qwq-32b",
      131072,
      GROQ_API
    )
  ).email;

  const mail_options = {
    from: `"${name}" <${user}>`,
    to: sender,
    subject,
    text,
  };
  await sendmail(transport_config, mail_options);
};

const monitorMail = async () => {
  scanMailBox_WS(mailboxConfig, process_mail);
};

monitorMail();
