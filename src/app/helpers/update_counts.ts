import { omit } from 'lodash';
import logger from '../../services/logger';
import prisma from '../../services/prisma';

export const updateLanguageCounts = async () => {
  const [languages, languageCounts] = await Promise.all([
    prisma.language.findMany(),
    prisma.movie.groupBy({
      by: ['languageId'],
      _count: true,
    }),
  ]);

  const languagesWithCounts = languages.map((l) => {
    const lc = languageCounts.find((lc) => lc.languageId === l.id);
    const count = lc ? lc._count : l.count;
    return { ...l, count };
  });

  await prisma.language.deleteMany();
  await prisma.language.createMany({ data: languagesWithCounts });

  logger.info(`updated language counts`);
};

export const updateWatchProviderCounts = async () => {
  const watchProvidersWithCounts = await prisma.watchProvider.findMany({
    include: {
      _count: {
        select: {
          movies: true,
        },
      },
    },
  });

  const watchProviders = watchProvidersWithCounts.map((wp) => ({
    ...omit(wp, ['_count']),
    count: wp._count.movies,
  }));

  await Promise.all(
    watchProviders.map(async (p) => {
      await prisma.watchProvider.upsert({
        create: p,
        update: p,
        where: { id: p.id },
      });
    }),
  );

  logger.info(`updated watch provider counts`);
};