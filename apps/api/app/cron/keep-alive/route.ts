import { database } from '@repo/database';

export const POST = async () => {
  const newPage = await database.waitlist.create({
    data: {
      name: 'cron-temp',
      email: 'test@test.com',
    },
  });

  await database.waitlist.delete({
    where: {
      id: newPage.id,
    },
  });

  return new Response('OK', { status: 200 });
};
