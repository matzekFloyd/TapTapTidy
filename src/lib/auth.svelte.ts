import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { supabase } from '$lib/supabase';
import type { Session } from '@supabase/supabase-js';

export const authState = $state({
	session: null as Session | null,
	initializing: true,
	/** Set when the session ends unexpectedly (e.g. sign-out elsewhere). */
	sessionEndedMessage: null as string | null
});

if (browser) {
	void supabase.auth.getSession().then(({ data }) => {
		authState.session = data.session;
		authState.initializing = false;
	});

	supabase.auth.onAuthStateChange((event, session) => {
		const hadSession = authState.session !== null;
		authState.session = session;
		authState.initializing = false;

		if (event === 'SIGNED_OUT' || (hadSession && !session)) {
			authState.sessionEndedMessage = 'Your session ended. Please sign in again.';
			if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
				void goto('/login');
			}
		}
	});
} else {
	authState.initializing = false;
}

export async function signOut(): Promise<void> {
	await supabase.auth.signOut();
}
