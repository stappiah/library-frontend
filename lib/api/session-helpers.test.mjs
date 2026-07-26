import test from 'node:test';
import assert from 'node:assert/strict';
import { clearExpiredSession } from './session-helpers.mjs';

test('clearExpiredSession clears stored auth data and notifies the app', () => {
  const calls = [];
  const storage = new Map([
    ['luma-auth', 'persisted'],
    ['luma-auth-access-token', 'access-token'],
    ['luma-auth-refresh-token', 'refresh-token'],
    ['other-cache', 'keep-me'],
  ]);

  const fakeStorage = {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, value);
    },
    removeItem(key) {
      storage.delete(key);
    },
  };

  const redirected = [];
  const previousWindow = globalThis.window;
  globalThis.window = {
    location: {
      pathname: '/account',
      assign(target) {
        redirected.push(target);
      },
    },
    localStorage: fakeStorage,
  };

  try {
    clearExpiredSession({
      storage: fakeStorage,
      dispatch: () => calls.push('dispatch'),
      redirectTo: '/login',
    });
  } finally {
    globalThis.window = previousWindow;
  }

  assert.deepEqual(calls, ['dispatch']);
  assert.deepEqual(redirected, ['/login']);
  assert.equal(fakeStorage.getItem('luma-auth'), null);
  assert.equal(fakeStorage.getItem('luma-auth-access-token'), null);
  assert.equal(fakeStorage.getItem('luma-auth-refresh-token'), null);
  assert.equal(fakeStorage.getItem('other-cache'), 'keep-me');
});
