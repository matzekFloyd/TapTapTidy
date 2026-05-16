import type { PostgrestError } from '@supabase/supabase-js';
import { AuthRequiredError } from '$lib/auth-user';

function isPostgrestError(error: unknown): error is PostgrestError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as PostgrestError).message === 'string'
	);
}

/**
 * Map PostgREST / RLS failures to short user-facing copy.
 */
export function getSupabaseErrorMessage(error: unknown): string {
	if (error instanceof AuthRequiredError) {
		return error.message;
	}

	if (!isPostgrestError(error)) {
		return 'Something went wrong. Please try again.';
	}

	if (error.code === '42501') {
		return 'You do not have permission to do that.';
	}

	if (error.code === 'PGRST301' || error.message.toLowerCase().includes('jwt')) {
		return 'Your session expired. Please sign in again.';
	}

	return error.message;
}
