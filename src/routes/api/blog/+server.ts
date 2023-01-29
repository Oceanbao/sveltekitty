import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export async function GET() {
	const blogs = await prisma.blog.findMany({
		where: { published: true },
		include: { author: true }
	});

	return json(blogs);
}

export const POST: RequestHandler = async ({ request }) => {
	const { title, content, authorEmail } = await request.json();
	const createdPost = await prisma.blog.create({
		data: {
			title: title,
			content: content,
			author: { connect: { email: authorEmail } }
		}
	});

	return json(createdPost);
};
