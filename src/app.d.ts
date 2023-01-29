// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				username: string;
				email: string;
				image: string;
				bio: string | null;
				token: string | null;
			} | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
