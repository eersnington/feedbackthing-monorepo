'use server';

import { resend } from '@repo/email';
import { ContactTemplate } from '@repo/email/templates/contact';
import { env } from '@repo/env';
import { parseError } from '@repo/observability/error';
import { log } from '@repo/observability/log';
import { createRateLimiter, slidingWindow } from '@repo/rate-limit';
import { headers } from 'next/headers';

export const contact = async (
  name: string,
  email: string,
  message: string
): Promise<{
  error?: string;
}> => {
  try {
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      const rateLimiter = createRateLimiter({
        limiter: slidingWindow(1, '1d'),
      });
      const head = await headers();
      const ip = head.get('x-real-ip');

      log.info(`Rate limiting contact form for IP: ${ip}`);
      const { success } = await rateLimiter.limit(`contact_form_${ip}`);
      log.info(`Rate limit success: ${success}`);

      if (!success) {
        throw new Error(
          'You have reached your request limit. Please try again later.'
        );
      }
    } else {
      log.warn(
        'Rate limiting is disabled. Please enable rate limiting in production.'
      );
    }

    await resend.emails.send({
      from: env.RESEND_FROM,
      to: env.RESEND_FROM,
      subject: 'Contact form submission',
      replyTo: email,
      react: <ContactTemplate name={name} email={email} message={message} />,
    });

    return {};
  } catch (error) {
    const errorMessage = parseError(error);

    return { error: errorMessage };
  }
};
