import { describe, it, expect } from 'vitest';
import { APP_NAME } from './app';

describe('app', () => {
	it('has the correct name', () => {
		expect(APP_NAME).toBe('TapTapTidy');
	});
});
