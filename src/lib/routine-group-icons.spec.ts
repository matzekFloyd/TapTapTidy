import { describe, it, expect } from 'vitest';
import { ROUTINE_GROUP_SEED_ICON_KEYS } from './routine-groups';
import {
	getRoutineGroupIcon,
	isWhitelistedRoutineGroupIconKey,
	ROUTINE_GROUP_ICON_FALLBACK_KEY
} from './routine-group-icons';
import {
	LayoutGrid,
	Sparkles,
	ClipboardList,
	HeartPulse,
	Users,
	Shapes
} from '@lucide/svelte';

describe('getRoutineGroupIcon', () => {
	it('maps seeded catalog icon_key values to lucide components', () => {
		expect(getRoutineGroupIcon('layout-grid')).toBe(LayoutGrid);
		expect(getRoutineGroupIcon('sparkles')).toBe(Sparkles);
		expect(getRoutineGroupIcon('clipboard-list')).toBe(ClipboardList);
		expect(getRoutineGroupIcon('heart-pulse')).toBe(HeartPulse);
		expect(getRoutineGroupIcon('users')).toBe(Users);
		expect(getRoutineGroupIcon('shapes')).toBe(Shapes);
	});

	it('falls back for unknown or empty keys', () => {
		const fallback = getRoutineGroupIcon(ROUTINE_GROUP_ICON_FALLBACK_KEY);
		expect(getRoutineGroupIcon('not-a-real-icon')).toBe(fallback);
		expect(getRoutineGroupIcon(null)).toBe(fallback);
		expect(getRoutineGroupIcon(undefined)).toBe(fallback);
	});

	it('whitelists all six seeded catalog icon_key values', () => {
		expect(ROUTINE_GROUP_SEED_ICON_KEYS).toHaveLength(6);

		const unknownIcon = getRoutineGroupIcon('__not-in-whitelist__');

		for (const iconKey of ROUTINE_GROUP_SEED_ICON_KEYS) {
			expect(isWhitelistedRoutineGroupIconKey(iconKey)).toBe(true);
			const icon = getRoutineGroupIcon(iconKey);
			if (iconKey === ROUTINE_GROUP_ICON_FALLBACK_KEY) {
				expect(icon).toBe(Shapes);
			} else {
				expect(icon).not.toBe(unknownIcon);
			}
		}
	});
});
