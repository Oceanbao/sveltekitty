export const prerender = false;

import type { Blog } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params: { id } }) => {
	const response = await fetch(`/api/blog/post/${id}`);

	return { post: (await response.json()) as Blog };
};
