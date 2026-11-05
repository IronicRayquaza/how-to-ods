const { test } = require('node:test');
const assert = require('node:assert');

Object.assign(globalThis, require('./snippet.js'));
const render = require('./render.js');

test('linkFor({file: "ods/FAQ.md", line: 12}) is "https://github.com/Osmantic/ODS/blob/main/ods/FAQ.md#L12"', () => {
  assert.strictEqual(render.linkFor({file: 'ods/FAQ.md', line: 12}), 'https://github.com/Osmantic/ODS/blob/main/ods/FAQ.md?plain=1#L12');
});

test('cardHtml html contains expected values and exclusions', () => {
  const html = render.cardHtml({file: 'ods/FAQ.md', heading: 'What is <ODS>?', line: 12, text: 'ODS is a local AI stack.'}, ['local']);
  assert.ok(html.includes('ods/FAQ.md?plain=1#L12'));
  assert.ok(html.includes('&lt;ODS&gt;'));
  assert.ok(html.includes('<mark>local</mark>'));
  assert.ok(!html.includes('<ODS>'));
  assert.ok(!html.includes('Where this error comes from'));
});

test('cardHtml for error kind contains tag', () => {
  const html = render.cardHtml({file: 'ods/a.sh', heading: 'Error: Docker is not running.', line: 5, text: 'Docker is not running.', kind: 'error'}, ['docker']);
  assert.ok(html.includes('Where this error comes from'));
});

test('emptyHtml("<x>") contains "&lt;x&gt;"', () => {
  const html = render.emptyHtml('<x>');
  assert.ok(html.includes('&lt;x&gt;'));
});