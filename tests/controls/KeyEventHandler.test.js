import { describe, it, expect } from 'vitest';
import KEYS from 'Controls/KeyEventHandler.js';

const keydown = init => new KeyboardEvent('keydown', init);

describe('KEYS.isMacOptionText', () => {
	it('treats Option+G typing @ on macOS as text', () => {
		const event = keydown({ key: '@', code: 'KeyG', altKey: true });
		expect(KEYS.isMacOptionText(event, 'macOS')).toBe(true);
		expect(KEYS.isMacOptionText(event, 'MacIntel')).toBe(true);
	});

	it('treats a macOS Option dead key as text', () => {
		expect(KEYS.isMacOptionText(keydown({ key: 'Dead', code: 'KeyN', altKey: true }), 'macOS')).toBe(true);
	});

	it('keeps Alt+G a shortcut outside macOS', () => {
		const event = keydown({ key: 'g', code: 'KeyG', altKey: true });
		expect(KEYS.isMacOptionText(event, 'Win32')).toBe(false);
		expect(KEYS.isMacOptionText(event, 'Linux x86_64')).toBe(false);
	});

	it('ignores Option with Ctrl or Cmd, and Option+arrow keys', () => {
		expect(KEYS.isMacOptionText(keydown({ key: 'g', altKey: true, ctrlKey: true }), 'macOS')).toBe(false);
		expect(KEYS.isMacOptionText(keydown({ key: 'g', altKey: true, metaKey: true }), 'macOS')).toBe(false);
		expect(KEYS.isMacOptionText(keydown({ key: 'ArrowLeft', altKey: true }), 'macOS')).toBe(false);
	});

	it('ignores keys typed without Option', () => {
		expect(KEYS.isMacOptionText(keydown({ key: 'g' }), 'macOS')).toBe(false);
	});

	it('is not listed among the key names', () => {
		expect(Object.keys(KEYS)).not.toContain('isMacOptionText');
	});
});
