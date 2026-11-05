const { test } = require('node:test');
const assert = require('node:assert');
const recipes = require('./recipes.js');
const data = require('./data.js');

const known = new Set(data.DOCS.map(c => c.file));

test('every recipe has a non-empty title, a non-empty query and at least one file', () => {
  for (const recipe of recipes.RECIPES) {
    assert.ok(recipe.title);
    assert.ok(recipe.query);
    assert.ok(recipe.files.length > 0);
  }
});

test('for every file f of every recipe: known.has(f)', () => {
  for (const recipe of recipes.RECIPES) {
    for (const f of recipe.files) {
      assert.ok(known.has(f), 'missing ' + f);
    }
  }
});