import { requireUserId } from '$lib/auth-user';
import type { Tables, TablesInsert } from '$lib/database.types';
import { supabase } from '$lib/supabase';

export type RoutineCompletionRow = Tables<'routine_completions'>;

/**
 * Record a completion; trigger updates routines.last_completed_at.
 * Do not set last_completed_at on the routine row from the client.
 */
export async function recordRoutineCompletion(
	routineId: string,
	completedAt?: string
): Promise<RoutineCompletionRow> {
	const userId = requireUserId();

	const row: TablesInsert<'routine_completions'> = {
		routine_id: routineId,
		user_id: userId,
		completed_by_user_id: userId,
		completed_at: completedAt ?? new Date().toISOString()
	};

	const { data, error } = await supabase
		.from('routine_completions')
		.insert(row)
		.select()
		.single();

	if (error) {
		throw error;
	}

	return data;
}

/** Remove the latest completion for a routine; trigger recomputes last_completed_at. */
export async function undoLatestRoutineCompletion(routineId: string): Promise<void> {
	requireUserId();

	const { data: latest, error: fetchError } = await supabase
		.from('routine_completions')
		.select('id')
		.eq('routine_id', routineId)
		.order('completed_at', { ascending: false })
		.limit(1)
		.maybeSingle();

	if (fetchError) {
		throw fetchError;
	}

	if (!latest) {
		return;
	}

	const { error: deleteError } = await supabase
		.from('routine_completions')
		.delete()
		.eq('id', latest.id);

	if (deleteError) {
		throw deleteError;
	}
}
