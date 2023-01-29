import { PrismaClient } from '@prisma/client';

import { env } from '@/env/server.mjs';

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

const prisma =
	global.prisma ||
	new PrismaClient({
		log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
	});

if (env.NODE_ENV !== 'production') {
	global.prisma = prisma;
}

prisma.$use(async (params, next) => {
  const before = Date.now()

  await new Promise(resolve => setInterval(resolve, 1500))

  const result = await next(params)

  const after = Date.now()

  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)

  return result
})

export default prisma;
