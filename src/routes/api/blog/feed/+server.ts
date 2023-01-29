import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export async function GET() {
	const feed = await prisma.blog.findMany({
		where: { published: true },
		include: { author: true }
	});

	return json(feed);
}
