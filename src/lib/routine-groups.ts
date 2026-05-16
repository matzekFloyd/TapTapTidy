/**
 * Canonical v1 catalog (keep in sync with supabase/migrations/*_routine_groups_seed.sql).
 */
export const ROUTINE_GROUP_CATALOG = [
	{ id: 'tidy', iconKey: 'layout-grid' },
	{ id: 'clean', iconKey: 'sparkles' },
	{ id: 'admin', iconKey: 'clipboard-list' },
	{ id: 'health', iconKey: 'heart-pulse' },
	{ id: 'social', iconKey: 'users' },
	{ id: 'other', iconKey: 'shapes' }
] as const;

/** Default home grid order (not alphabetical). */
export const ROUTINE_GROUP_GRID_ORDER = ROUTINE_GROUP_CATALOG.map((group) => group.id);

export type RoutineGroupId = (typeof ROUTINE_GROUP_CATALOG)[number]['id'];

export const ROUTINE_GROUP_SEED_ICON_KEYS = ROUTINE_GROUP_CATALOG.map((group) => group.iconKey);

export function isRoutineGroupId(id: string): id is RoutineGroupId {
	return (ROUTINE_GROUP_GRID_ORDER as readonly string[]).includes(id);
}
