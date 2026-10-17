import { authState } from '#lib/auth.svelte.ts';
import { AuthRequiredError } from '#lib/auth-errors.ts';

export { AuthRequiredError };

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
