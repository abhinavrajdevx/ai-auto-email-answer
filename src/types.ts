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

export interface TransportConfigObj {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface MailOptionsObj {
  from: string;
  to: string;
  subject: string;
  text: string;
}
