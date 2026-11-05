# How to ODS

Search every ODS guide, or paste an error message or a whole install log, and get the matching sections of the real [ODS](https://github.com/Osmantic/ODS) docs, quoted word for word, each linked to the exact file and line on GitHub. Nothing on the site is generated: every result comes straight from the ODS repo.

**Use it:** https://ironicrayquaza.github.io/how-to-ods/

Made for the ODS Weekly Dev Jam. Built inside **ODS Portal**, with the site code written by **Qwen3.5-4B** running locally on a laptop.

## What it does

- **Plain questions**: "switch model", "where are the logs", "install on windows". The FAQ and guide sections that answer them come first.
- **Pasted errors**: paste a line like `[ERROR] Failed to install NVIDIA Container Toolkit.` and the first result is a red **Where this error comes from** card: the ODS script and line that printed it, with the code around it. The docs that fix it come right after.
- **Pasted logs**: paste a whole chunk of installer output. The page keeps only the lines that look like errors (`[ERROR]`, `[XX]`, `✗`, `error:`, `fatal:`, `failed`) and shows a card for every ODS error it recognises.
- **Recipes**: 16 starting points (Install on Windows, Fix a failed install, Switch or add a model, …) for people who don't know what to search for.
- **View on GitHub ↗** on every result opens the source at the exact line.
- **Can't find it?** Under every search: report it on GitHub (the ODS bug report form opens with what you typed already filled in) or ask on the ODS Discord.

Press `Esc` or the `×` button to clear the search and go back to the recipes.

## How it stays up to date

The search index is `data.js`, built from the ODS repo by `build-index.js`. A GitHub Actions workflow ([`.github/workflows/pages.yml`](.github/workflows/pages.yml)) runs every night, on every push to `main`, and on demand:

1. Clones the latest `Osmantic/ODS`.
2. Rebuilds `data.js` with `build-index.js`.
3. Runs the tests. If ODS renamed a doc that a recipe points at, `recipes.test.js` fails, nothing is saved or published, and the live site keeps the last good index. Fix the path in `recipes.js` and push.
4. Commits the new `data.js` if anything changed, then publishes the site to GitHub Pages.

So the docs, error messages and line numbers on the site are never more than a day behind ODS.

## Deploy your own copy

1. Push this repo to GitHub.
2. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Open the **Actions** tab, pick **Update index and deploy**, and click **Run workflow**. Every push to `main` also deploys.

The site is fully static: no server, no build step for the page itself, and no network calls at runtime.

## Run it locally

Open `index.html` in a browser, or serve the folder with any static server:

```
npx serve .
```

Run the tests (Node 18+):

```
node --test
```

Rebuild the index from the latest ODS:

```
git clone --depth 1 https://github.com/Osmantic/ODS ods-source
node build-index.js ods-source data.js
```

`ods-source/` is in `.gitignore`.

## How it was made

- The site code was written by Qwen3.5-4B (Q4_K_M) inside ODS Portal, running locally on an RTX 3050 4 GB laptop.
- The prompts, with Portal's replies, including failed attempts and fixes, are in [PROMPTS.md](PROMPTS.md).
- The logic is split into small files, and each one (splitting docs into sections, choosing files, finding error messages, ranking, snippets, result cards, recipes, log splitting) has a test the model ran itself in the Portal sandbox.
- Added by hand rather than by the model: the copy of the ODS repo the index was first built from, the fonts and logo, `search.test.js` (see the note before Prompt 9 in PROMPTS.md), and the hosting files (`.github/workflows/pages.yml`, this README, `NOTICE`, `.gitignore`).

## Files

| File | What it does |
|---|---|
| `index.html` | Page, styles and script order |
| `app.js` | Search box, results, recipes, clear button and Esc |
| `search.js` | Tokenizing, rare-word weighting, exact error matching, ranking |
| `logsplit.js` | Picks the error lines out of a pasted log and merges their results |
| `snippet.js` | HTML escaping, snippets around the first match, highlighting |
| `render.js` | Result cards, GitHub links, the "can't find it" help box |
| `recipes.js` | The 16 recipe buttons and the doc files each one searches |
| `build-index.js` | Node script: reads the ODS repo and writes `data.js` |
| `chunk.js`, `include.js`, `errors.js` | Split markdown into sections, choose which files to read, find error messages in scripts |
| `data.js` | The generated index (about 2,700 sections). Never edited by hand |
| `*.test.js` | Tests (`node --test`) |
| `fonts/`, `ods-logo.png` | Fonts and the ODS logo |

## Credits and license

- Code: [Apache License 2.0](LICENSE), as required by the ODS Weekly Dev Jam. See [NOTICE](NOTICE).
- Content: `data.js` quotes the [Osmantic/ODS](https://github.com/Osmantic/ODS) docs and scripts (Apache-2.0); every result links back to its source.
- Fonts: **Inter** and **JetBrains Mono** ([fonts/OFL.txt](fonts/OFL.txt)) and **Sora** ([fonts/SORA-OFL.txt](fonts/SORA-OFL.txt)), all under the SIL Open Font License 1.1.
- The ODS logo belongs to the ODS project and is not covered by this repo's license.
- Not an official Osmantic project.
