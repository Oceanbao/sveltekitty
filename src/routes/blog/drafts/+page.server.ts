import type { Blog } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/blog/drafts');

	return { drafts: (await response.json()) as Blog[] };
};
