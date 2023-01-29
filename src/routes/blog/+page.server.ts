import type { Blog } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/blog/feed');

	return { feed: (await response.json()) as Blog[] };
};
