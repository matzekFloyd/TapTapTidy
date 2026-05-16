import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoutine } from './routines-db';

const USER_ID = '00000000-0000-4000-8000-000000000001';

const { mockSingle, mockSelect, mockInsert, mockFrom } = vi.hoisted(() => {
	const mockSingle = vi.fn();
	const mockSelect = vi.fn(() => ({ single: mockSingle }));
	const mockInsert = vi.fn(() => ({ select: mockSelect }));
	const mockFrom = vi.fn(() => ({ insert: mockInsert }));
	return { mockSingle, mockSelect, mockInsert, mockFrom };
});

vi.mock('./supabase', () => ({
	supabase: { from: mockFrom }
}));

vi.mock('./auth-user', () => ({
	requireUserId: () => USER_ID
}));

describe('createRoutine', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('inserts with user_id from session, not from input', async () => {
		const created = {
			id: 'routine-1',
			user_id: USER_ID,
			group_id: 'tidy',
			title: 'Dishes',
			description: null,
			interval_days: 2,
			last_completed_at: null,
			archived_at: null,
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-01-01T00:00:00Z'
		};
		mockSingle.mockResolvedValue({ data: created, error: null });

		await expect(
			createRoutine({
				group_id: 'tidy',
				title: 'Dishes',
				interval_days: 2
			})
		).resolves.toEqual(created);

		expect(mockInsert).toHaveBeenCalledWith({
			user_id: USER_ID,
			group_id: 'tidy',
			title: 'Dishes',
			description: null,
			interval_days: 2
		});
	});
});
