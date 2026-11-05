const fs = require('fs'); const path = require('path');
const { splitMarkdown } = require('./chunk.js'); const { shouldInclude, isErrorSource } = require('./include.js'); const { errorChunks } = require('./errors.js');
const root = process.argv[2]; const out = process.argv[3];
function walk(dir) {
    const found = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === '.git' || entry.name === 'node_modules') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            for (const item of walk(full)) found.push(item);
        } else {
            found.push(full);
        }
    }
    return found;
}
const chunks = [];
let errorCount = 0;
for (const file of walk(root)) {
    const rel = path.relative(root, file).split(path.sep).join('/');
    if (shouldInclude(rel)) {
        const content = fs.readFileSync(file, 'utf8');
        for (const section of splitMarkdown(rel, content)) {
            if (section.text.length >= 40) chunks.push(section);
        }
    } else if (isErrorSource(rel)) {
        const found = errorChunks(rel, fs.readFileSync(file, 'utf8'));
        errorCount += found.length;
        for (const item of found) chunks.push(item);
    }
}
const outContent = 'const DOCS = ' + JSON.stringify(chunks) + ';\n' + 'if (typeof module !== "undefined") { module.exports = { DOCS }; }\n';
fs.writeFileSync(out, outContent);
console.log(chunks.length + ' sections written to ' + out + ' (' + errorCount + ' error messages)');
