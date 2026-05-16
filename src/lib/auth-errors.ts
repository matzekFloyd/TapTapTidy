/** Auth errors without pulling in Supabase or Svelte session modules (safe for unit tests). */
export class AuthRequiredError extends Error {
	constructor(message = 'You must be signed in to continue.') {
		super(message);
		this.name = 'AuthRequiredError';
	}
}
