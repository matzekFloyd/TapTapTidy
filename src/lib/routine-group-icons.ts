import {
	LayoutGrid,
	Sparkles,
	ClipboardList,
	HeartPulse,
	Users,
	Shapes
} from '@lucide/svelte';

export type RoutineGroupIcon = typeof LayoutGrid;

/** Lucide name used when icon_key is missing or unknown. */
export const ROUTINE_GROUP_ICON_FALLBACK_KEY = 'shapes';

const ICON_BY_KEY: Record<string, RoutineGroupIcon> = {
	'layout-grid': LayoutGrid,
	sparkles: Sparkles,
	'clipboard-list': ClipboardList,
	'heart-pulse': HeartPulse,
	users: Users,
	shapes: Shapes
};

const FALLBACK_ICON = ICON_BY_KEY[ROUTINE_GROUP_ICON_FALLBACK_KEY];

export function isWhitelistedRoutineGroupIconKey(iconKey: string): boolean {
	return Object.hasOwn(ICON_BY_KEY, iconKey);
}

/**
 * Resolve catalog icon_key to a @lucide/svelte component (whitelist only).
 */
export function getRoutineGroupIcon(iconKey: string | null | undefined): RoutineGroupIcon {
	if (!iconKey) {
		return FALLBACK_ICON;
	}
	return ICON_BY_KEY[iconKey] ?? FALLBACK_ICON;
}
