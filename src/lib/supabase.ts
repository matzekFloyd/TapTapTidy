import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$app/env/public';
import type { Database } from './database.types.ts';

export const supabase = createBrowserClient<Database>(
	PUBLIC_SUPABASE_URL ?? '',
	PUBLIC_SUPABASE_ANON_KEY ?? ''
);
