const auth = ['none', 'nextauth', 'supabase'];
const orm = ['none', 'drizzle', 'prisma', 'mongoose'];
const payments = ['none', 'one-time', 'subscriptions'];

export const matrix = auth.flatMap((authName, authIndex) => orm.map((ormName, ormIndex) => {
  const index = authIndex * orm.length + ormIndex;
  return {
    id: `${authName}-${ormName}`,
    auth: authName,
    roles: authName === 'supabase' && ormIndex % 2 === 1,
    orm: ormName,
    payments: payments[index % payments.length],
    pwa: index % 2 === 0,
    sentry: index % 3 === 0,
    storybook: index % 4 < 2,
  };
}));
