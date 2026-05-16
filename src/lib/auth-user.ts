import { authState } from '$lib/auth.svelte';

export class AuthRequiredError extends Error {
	constructor(message = 'You must be signed in to continue.') {
		super(message);
		this.name = 'AuthRequiredError';
	}
}

export function getSessionUserId(): string | null {
	return authState.session?.user.id ?? null;
}

/** Session user id for Supabase writes; never accept user_id from form input. */
export function requireUserId(): string {
	const userId = getSessionUserId();
	if (!userId) {
		throw new AuthRequiredError();
	}
	return userId;
}
