import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthRequiredError, getSessionUserId, requireUserId } from './auth-user';

const mockAuthState = vi.hoisted(() => ({
	session: null as { user: { id: string } } | null
}));

vi.mock('$lib/auth.svelte', () => ({
	authState: mockAuthState
}));

describe('auth-user', () => {
	beforeEach(() => {
		mockAuthState.session = null;
	});

	it('requireUserId returns session user id', () => {
		mockAuthState.session = { user: { id: 'user-abc' } };
		expect(requireUserId()).toBe('user-abc');
		expect(getSessionUserId()).toBe('user-abc');
	});

	it('requireUserId throws when not signed in', () => {
		expect(() => requireUserId()).toThrow(AuthRequiredError);
	});
});
