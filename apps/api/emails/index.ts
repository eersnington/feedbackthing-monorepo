import { resend } from '@repo/email';
import type { JSXElementConstructor, ReactElement } from 'react';

export const sendEmail = async ({
  email,
  subject,
  react,
  marketing,
  test = process.env.NODE_ENV === 'development',
}: {
  email: string;
  subject: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // biome-ignore lint/suspicious/noExplicitAny: nothing to do here
  react: ReactElement<any, string | JSXElementConstructor<any>>;
  marketing?: boolean;
  test?: boolean;
}) => {
  if (!resend) {
    throw new Error(
      'Resend is not configured. You need to add a RESEND_API_KEY in your .env file for emails to work.'
    );
  }
  return resend.emails.send({
    from: marketing
      ? 'Sree from Feedbackthing <founders@feedbackthing.pro>'
      : 'Feedbackthing <system@feedbackthing.pro>',
    to: test ? 'delivered@resend.dev' : email,
    subject,
    react,
  });
};

export const sendBatchEmails = async ({
  emails,
  subject,
  reactEmails,
  headers,
  marketing,
  test = process.env.NODE_ENV === 'development',
}: {
  emails: string[];
  subject: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // biome-ignore lint/suspicious/noExplicitAny: nothing to do here
  reactEmails: ReactElement<any, string | JSXElementConstructor<any>>[];
  headers?: Record<string, string>[];
  marketing?: boolean;
  test?: boolean;
}) => {
  if (!resend) {
    throw new Error(
      'Resend is not configured. You need to add a RESEND_API_KEY in your .env file for emails to work.'
    );
  }

  if (emails.length !== reactEmails.length) {
    throw new Error('emails and reactEmails arrays must be the same length.');
  }

  if (headers && emails.length !== headers.length) {
    throw new Error('emails and headers arrays must be the same length.');
  }

  return resend.batch.create(
    emails.map((email) => ({
      from: marketing
        ? 'Sree from Feedbackthing <founders@feedbackthing.pro>'
        : 'Feedbackthing <system@feedbackthing.pro>',
      to: test ? 'delivered@resend.dev' : email,
      subject,
      headers: headers ? headers[emails.indexOf(email)] : undefined,
      react: reactEmails[emails.indexOf(email)],
    }))
  );
};
