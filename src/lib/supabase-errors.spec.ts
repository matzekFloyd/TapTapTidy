import { describe, it, expect } from 'vitest';
import { AuthRequiredError } from '$lib/auth-user';
import { getSupabaseErrorMessage } from './supabase-errors';

describe('getSupabaseErrorMessage', () => {
	it('maps RLS errors', () => {
		expect(getSupabaseErrorMessage({ message: 'nope', code: '42501' })).toBe(
			'You do not have permission to do that.'
		);
	});

	it('maps auth required', () => {
		expect(getSupabaseErrorMessage(new AuthRequiredError())).toBe(
			'You must be signed in to continue.'
		);
	});
});
