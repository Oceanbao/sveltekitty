import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params: { id } }) => {
	const post = await prisma.blog.findUnique({
		where: { id: Number(id) },
		include: { author: true }
	});

	return json(post);
};

export const DELETE: RequestHandler = async ({ params: { id } }) => {
	const deletedPost = await prisma.blog.delete({
		where: { id: Number(id) }
	});

	return json(deletedPost);
};
