import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params: { id } }) => {
	const updatedPost = await prisma.blog.update({
		where: { id: Number(id) },
		data: {
			published: true
		}
	});

	return json(updatedPost);
};
