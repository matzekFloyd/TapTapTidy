import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listRoutineGroupsCatalog } from './routine-groups-db';

const { mockSelect, mockFrom } = vi.hoisted(() => {
	const mockSelect = vi.fn();
	const mockFrom = vi.fn((_table: string) => ({ select: mockSelect }));
	return { mockSelect, mockFrom };
});

vi.mock('./supabase', () => ({
	supabase: {
		from: mockFrom
	}
}));

vi.mock('./auth-user', () => ({
	requireUserId: () => '00000000-0000-4000-8000-000000000001'
}));

describe('listRoutineGroupsCatalog', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('queries routine_groups with typed client', async () => {
		const rows = [
			{
				id: 'tidy',
				name: 'Tidy',
				description: 'Put things away.',
				icon_key: 'layout-grid',
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z'
			}
		];
		mockSelect.mockResolvedValue({ data: rows, error: null });

		await expect(listRoutineGroupsCatalog()).resolves.toEqual(rows);
		expect(mockFrom).toHaveBeenCalledWith('routine_groups');
		expect(mockSelect).toHaveBeenCalledWith('*');
	});

	it('throws when Supabase returns an error', async () => {
		const error = { message: 'RLS denied', code: '42501' };
		mockSelect.mockResolvedValue({ data: null, error });

		await expect(listRoutineGroupsCatalog()).rejects.toEqual(error);
	});
});
