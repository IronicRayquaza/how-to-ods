const input = document.getElementById('q');
const clearButton = document.getElementById('clear');
const count = document.getElementById('count');
const recipesBox = document.getElementById('recipes');
const results = document.getElementById('results');
let timer = null;

function fitBox() {
  input.style.height = 'auto';
  const full = input.scrollHeight + 2;
  input.style.height = Math.min(full, 160) + 'px';
  input.style.overflowY = full > 160 ? 'auto' : 'hidden';
  clearButton.hidden = input.value === '';
}

function showRecipes() {
  recipesBox.innerHTML = '';
  for (let i = 0; i < RECIPES.length; i++) {
    const r = RECIPES[i];
    const btn = document.createElement('button');
    btn.textContent = r.title;
    btn.onclick = () => runRecipe(i);
    recipesBox.appendChild(btn);
  }
}

function showResults(list, terms, label) {
  recipesBox.style.display = 'none';
  if (list.length === 0) {
    results.innerHTML = emptyHtml(label) + helpHtml(label);
    count.textContent = '';
    return;
  }
  count.textContent = list.length + ' matching sections from the ODS repo';
  results.innerHTML = list.map(r => cardHtml(r.chunk, terms)).join('') + helpHtml(label);
}

function runQuery(query) {
  const q = query.trim();
  history.replaceState(null, '', q ? '?q=' + encodeURIComponent(q) : location.pathname);
  if (!q) {
    results.innerHTML = '';
    count.textContent = '';
    recipesBox.style.display = '';
    return;
  }
  const lines = errorLines(q);
  if (lines.length > 0) {
    showResults(mergeResults(lines.map(l => pickResults(search(DOCS, l, 60), 4)), 20), tokenize(lines.join(' ')), q);
    return;
  }
  showResults(pickResults(search(DOCS, q, 60), 20), tokenize(q), q);
}

function runRecipe(i) {
  const r = RECIPES[i];
  input.value = r.query;
  fitBox();
  const docs = DOCS.filter(c => r.files.includes(c.file));
  let list = search(docs, r.query, 20);
  if (list.length === 0) {
    list = docs.slice(0, 20).map(c => ({ chunk: c, score: 0 }));
  }
  showResults(list, tokenize(r.query), r.query);
}

function clearAll() {
  clearTimeout(timer);
  input.value = '';
  fitBox();
  runQuery('');
  input.focus();
}

input.addEventListener('input', () => {
  fitBox();
  clearTimeout(timer);
  timer = setTimeout(() => runQuery(input.value), 200);
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') clearAll();
});

clearButton.addEventListener('click', clearAll);

showRecipes();
const start = new URLSearchParams(location.search).get('q');
if (start) {
  input.value = start;
  runQuery(start);
}
fitBox();