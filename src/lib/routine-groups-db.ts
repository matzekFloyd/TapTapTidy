import type { Tables } from './database.types';
import { supabase } from './supabase';

export type RoutineGroupRow = Tables<'routine_groups'>;

/**
 * Load the read-only routine_groups catalog (RLS: authenticated SELECT).
 * Sort in the UI with ROUTINE_GROUP_GRID_ORDER — PostgREST order is not guaranteed.
 */
export async function listRoutineGroupsCatalog(): Promise<RoutineGroupRow[]> {
	const { data, error } = await supabase.from('routine_groups').select('*');

	if (error) {
		throw error;
	}

	return data ?? [];
}
