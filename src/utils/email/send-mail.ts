import { MailOptionsObj, TransportConfigObj } from "../../types";

const nodemailer = require("nodemailer");

export const sendmail = async (
  transport_config: TransportConfigObj,
  mailOptions: MailOptionsObj
) => {
  const transporter = nodemailer.createTransport(transport_config);

  transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
    if (error) {
      return console.error("Error:", error);
    }
    console.log("Email sent:", info.response);
  });
};
