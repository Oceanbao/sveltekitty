import type { Handle } from '@sveltejs/kit';

export const handle = (({ event, resolve }) => {
	const jwt = event.cookies.get('jwt');
	event.locals.user = jwt ? JSON.parse(Buffer.from(jwt, 'base64').toString('utf8')) : null;

	return resolve(event);
}) satisfies Handle;
