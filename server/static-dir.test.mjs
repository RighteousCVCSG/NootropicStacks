import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveStaticDir } from '../server.js';

function withTempDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'nootropic-static-'));
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('uses the current directory when the server is started from built dist', () => {
  withTempDir((dir) => {
    mkdirSync(join(dir, 'assets'));
    writeFileSync(join(dir, 'index.html'), '<!doctype html>');

    assert.equal(resolveStaticDir(dir), dir);
  });
});

test('uses the dist directory when the server is started from the project root', () => {
  withTempDir((dir) => {
    const distDir = join(dir, 'dist');
    mkdirSync(distDir);
    writeFileSync(join(distDir, 'index.html'), '<!doctype html>');

    assert.equal(resolveStaticDir(dir), distDir);
  });
});

test('prefers dist when the project root also has a source index file', () => {
  withTempDir((dir) => {
    writeFileSync(join(dir, 'index.html'), '<!doctype html>');
    const distDir = join(dir, 'dist');
    mkdirSync(distDir);
    mkdirSync(join(distDir, 'assets'));
    writeFileSync(join(distDir, 'index.html'), '<!doctype html>');

    assert.equal(resolveStaticDir(dir), distDir);
  });
});
