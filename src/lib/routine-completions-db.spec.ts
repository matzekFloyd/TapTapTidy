import { describe, it, expect, vi, beforeEach } from 'vitest';
import { recordRoutineCompletion } from './routine-completions-db';

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

describe('recordRoutineCompletion', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('inserts completion with session user_id', async () => {
		const row = {
			id: 'completion-1',
			routine_id: 'routine-1',
			user_id: USER_ID,
			completed_by_user_id: USER_ID,
			completed_at: '2026-01-02T12:00:00Z'
		};
		mockSingle.mockResolvedValue({ data: row, error: null });

		await expect(
			recordRoutineCompletion('routine-1', '2026-01-02T12:00:00Z')
		).resolves.toEqual(row);

		expect(mockInsert).toHaveBeenCalledWith({
			routine_id: 'routine-1',
			user_id: USER_ID,
			completed_by_user_id: USER_ID,
			completed_at: '2026-01-02T12:00:00Z'
		});
	});
});
