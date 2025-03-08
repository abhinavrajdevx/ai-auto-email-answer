export interface Mail {
  subject: string;
  from: string;
  date: string;
  body: string;
}

export interface MailboxConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
  tlsOptions: {
    rejectUnauthorized: boolean;
  };
}
