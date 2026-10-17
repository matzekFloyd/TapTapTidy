import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	// Inlined at build time — required for adapter-static / Netlify.
	PUBLIC_SUPABASE_URL: { public: true, static: true },
	PUBLIC_SUPABASE_ANON_KEY: { public: true, static: true }
});
