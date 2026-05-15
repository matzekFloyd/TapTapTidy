import { browser } from '$app/environment';
import { supabase } from '$lib/supabase';
import type { Session } from '@supabase/supabase-js';

export const authState = $state({
	session: null as Session | null,
	initializing: true
});

if (browser) {
	void supabase.auth.getSession().then(({ data }) => {
		authState.session = data.session;
		authState.initializing = false;
	});

	supabase.auth.onAuthStateChange((_event, session) => {
		authState.session = session;
		authState.initializing = false;
	});
} else {
	authState.initializing = false;
}

export async function signOut(): Promise<void> {
	await supabase.auth.signOut();
}
