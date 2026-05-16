import { requireUserId } from '$lib/auth-user';
import type { Tables, TablesInsert, TablesUpdate } from '$lib/database.types';
import { supabase } from '$lib/supabase';

export type RoutineRow = Tables<'routines'>;

export type CreateRoutineInput = {
	group_id: string;
	title: string;
	description?: string | null;
	interval_days: number;
};

export type UpdateRoutineInput = {
	title?: string;
	description?: string | null;
	interval_days?: number;
	group_id?: string;
};

/** List routines for the signed-in user (RLS also enforces ownership). */
export async function listRoutines(options?: { includeArchived?: boolean }): Promise<RoutineRow[]> {
	const userId = requireUserId();

	let query = supabase.from('routines').select('*').eq('user_id', userId);

	if (!options?.includeArchived) {
		query = query.is('archived_at', null);
	}

	const { data, error } = await query.order('created_at', { ascending: true });

	if (error) {
		throw error;
	}

	return data ?? [];
}

export async function getRoutine(routineId: string): Promise<RoutineRow | null> {
	const userId = requireUserId();

	const { data, error } = await supabase
		.from('routines')
		.select('*')
		.eq('id', routineId)
		.eq('user_id', userId)
		.maybeSingle();

	if (error) {
		throw error;
	}

	return data;
}

export async function createRoutine(input: CreateRoutineInput): Promise<RoutineRow> {
	const userId = requireUserId();

	const row: TablesInsert<'routines'> = {
		user_id: userId,
		group_id: input.group_id,
		title: input.title,
		description: input.description ?? null,
		interval_days: input.interval_days
	};

	const { data, error } = await supabase.from('routines').insert(row).select().single();

	if (error) {
		throw error;
	}

	return data;
}

export async function updateRoutine(
	routineId: string,
	input: UpdateRoutineInput
): Promise<RoutineRow> {
	requireUserId();

	const patch: TablesUpdate<'routines'> = {};

	if (input.title !== undefined) patch.title = input.title;
	if (input.description !== undefined) patch.description = input.description;
	if (input.interval_days !== undefined) patch.interval_days = input.interval_days;
	if (input.group_id !== undefined) patch.group_id = input.group_id;

	const { data, error } = await supabase
		.from('routines')
		.update(patch)
		.eq('id', routineId)
		.select()
		.single();

	if (error) {
		throw error;
	}

	return data;
}

export async function archiveRoutine(routineId: string): Promise<RoutineRow> {
	requireUserId();

	const { data, error } = await supabase
		.from('routines')
		.update({ archived_at: new Date().toISOString() })
		.eq('id', routineId)
		.select()
		.single();

	if (error) {
		throw error;
	}

	return data;
}

export async function deleteRoutine(routineId: string): Promise<void> {
	requireUserId();

	const { error } = await supabase.from('routines').delete().eq('id', routineId);

	if (error) {
		throw error;
	}
}
