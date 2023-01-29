import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export async function GET() {
	const drafts = await prisma.blog.findMany({
		where: { published: false },
		include: { author: true }
	});

	return json(drafts);
}
