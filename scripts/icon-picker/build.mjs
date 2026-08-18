// Emits a single self-contained index.html for reviewing/curating the icon set.
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { GROUPS, AMBIENT_DEFAULT, RENAME_MAP, PENDING_PURGE } from './candidates.mjs'

const dir = import.meta.dirname
const icons = JSON.parse(await readFile(path.join(dir, 'icons.json'), 'utf8'))

const data = {
  icons: icons.map((i) => [i.name, i.kebab, i.node]),
  groups: GROUPS,
  ambient: AMBIENT_DEFAULT,
  renameMap: RENAME_MAP,
  pendingPurge: PENDING_PURGE,
  // Export names that legacy DB rows still point at — cutting one costs a purge.
  currentInUse: Object.values(RENAME_MAP),
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Icon set curation</title>
<style>
  :root {
    --bg: #fbfaf8; --panel: #fff; --ink: #1c1a17; --muted: #6b655c;
    --line: #e2ddd4; --pick: #2563eb; --pick-bg: #eaf1ff;
    --amb: #a855f7; --amb-bg: #f6ecff; --warn: #b45309; --warn-bg: #fff5e6;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #17161a; --panel: #1f1e24; --ink: #f2efe9; --muted: #9d968b;
      --line: #332f38; --pick: #7ba4ff; --pick-bg: #1b2740;
      --amb: #c88dff; --amb-bg: #2a1e3a; --warn: #f0b25e; --warn-bg: #3a2c14;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--ink);
    font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, sans-serif;
  }
  header {
    position: sticky; top: 0; z-index: 10; background: var(--panel);
    border-bottom: 1px solid var(--line); padding: 14px 20px;
    display: flex; gap: 14px; align-items: center; flex-wrap: wrap;
  }
  h1 { font-size: 16px; margin: 0; font-weight: 650; letter-spacing: -0.01em; }
  .counts { display: flex; gap: 10px; font-size: 13px; color: var(--muted); }
  .counts b { color: var(--ink); font-variant-numeric: tabular-nums; }
  input[type=search] {
    flex: 1; min-width: 200px; padding: 7px 11px; border-radius: 8px;
    border: 1px solid var(--line); background: var(--bg); color: var(--ink); font-size: 14px;
  }
  button {
    font: inherit; font-size: 13px; padding: 7px 12px; border-radius: 8px;
    border: 1px solid var(--line); background: var(--bg); color: var(--ink); cursor: pointer;
  }
  button:hover { border-color: var(--muted); }
  button.primary { background: var(--pick); border-color: var(--pick); color: #fff; }
  main { padding: 20px; max-width: 1400px; margin: 0 auto; }
  .legend {
    display: flex; gap: 18px; flex-wrap: wrap; font-size: 13px;
    color: var(--muted); margin-bottom: 18px; align-items: center;
  }
  .swatch { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 5px; vertical-align: -1px; }
  section { margin-bottom: 30px; }
  .sec-head { display: flex; gap: 10px; align-items: baseline; margin-bottom: 4px; flex-wrap: wrap; }
  h2 { font-size: 14px; margin: 0; font-weight: 650; }
  .sec-head .n { font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
  .sec-head .acts { margin-left: auto; display: flex; gap: 6px; }
  .sec-head .acts button { padding: 3px 8px; font-size: 12px; }
  .note { font-size: 12px; color: var(--warn); background: var(--warn-bg); padding: 6px 10px; border-radius: 6px; margin: 6px 0 10px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 8px; }
  .cell {
    position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 12px 6px 8px; border: 1px solid var(--line); border-radius: 10px;
    background: var(--panel); cursor: pointer; user-select: none; text-align: center;
  }
  .cell svg { width: 26px; height: 26px; stroke: currentColor; }
  .cell .nm { font-size: 10.5px; line-height: 1.25; color: var(--muted); word-break: break-word; }
  .cell[data-state=picker] { border-color: var(--pick); background: var(--pick-bg); }
  .cell[data-state=picker] .nm { color: var(--ink); }
  .cell[data-state=ambient] { border-color: var(--amb); background: var(--amb-bg); }
  .cell[data-state=ambient] .nm { color: var(--ink); }
  .cell[data-state=cut] { opacity: 0.42; }
  .cell .tag {
    position: absolute; top: 4px; right: 5px; font-size: 9px; text-transform: uppercase;
    letter-spacing: 0.04em; font-weight: 700; color: var(--amb);
  }
  .cell .used {
    position: absolute; top: 4px; left: 5px; font-size: 9px; font-weight: 700; color: var(--warn);
  }
  dialog {
    border: 1px solid var(--line); border-radius: 12px; background: var(--panel); color: var(--ink);
    max-width: min(820px, 92vw); width: 100%; padding: 0;
  }
  dialog::backdrop { background: rgb(0 0 0 / 0.45); }
  .dlg-head { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid var(--line); }
  .dlg-head h3 { margin: 0; font-size: 15px; }
  .dlg-body { padding: 18px; max-height: 66vh; overflow: auto; }
  .dlg-body h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin: 18px 0 6px; }
  .dlg-body h4:first-child { margin-top: 0; }
  pre {
    background: var(--bg); border: 1px solid var(--line); border-radius: 8px;
    padding: 12px; overflow-x: auto; font-size: 12px; line-height: 1.55; margin: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  .row { display: flex; gap: 8px; align-items: center; margin-top: 6px; }
  .empty { color: var(--muted); font-size: 13px; }
</style>
</head>
<body>
<header>
  <h1>Icon set curation</h1>
  <div class="counts">
    <span><span class="swatch" style="background:var(--pick)"></span>picker <b id="c-picker">0</b></span>
    <span><span class="swatch" style="background:var(--amb)"></span>ambient <b id="c-ambient">0</b></span>
    <span>cut <b id="c-cut">0</b></span>
  </div>
  <input type="search" id="q" placeholder="Filter candidates, or search all 1767 lucide icons to add&hellip;">
  <button id="reset">Reset</button>
  <button class="primary" id="export">Export &rarr;</button>
</header>
<main>
  <p class="legend">
    <span>Click a tile to cycle: <b>cut</b> &rarr; <b>picker</b> &rarr; <b>ambient</b>. Alt-click cycles back.</span>
    <span><span class="swatch" style="background:var(--pick)"></span><b>picker</b> = offered to editors</span>
    <span><span class="swatch" style="background:var(--amb)"></span><b>ambient</b> = also in the seeded-random doodle set (implies picker)</span>
    <span style="color:var(--warn)"><b>LIVE</b> = referenced by existing DB data; cutting it needs a purge</span>
  </p>
  <div id="results"></div>
  <div id="added"></div>
  <div id="sections"></div>
</main>

<dialog id="dlg">
  <div class="dlg-head">
    <h3>Registry output</h3>
    <button style="margin-left:auto" onclick="document.getElementById('dlg').close()">Close</button>
  </div>
  <div class="dlg-body" id="dlg-body"></div>
</dialog>

<script id="data" type="application/json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
<script>
const DATA = JSON.parse(document.getElementById('data').textContent);
const BY_NAME = new Map(DATA.icons.map(([n, k, node]) => [n, { name: n, kebab: k, node }]));
const CANDIDATES = [...new Set(DATA.groups.flatMap(g => g.icons))];
const LIVE = new Set(DATA.currentInUse);

// Bump when candidates.mjs changes shape, so stale marks can't leak into an export.
const STORE_KEY = 'icon-curation-v2';
let state = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved && typeof saved === 'object') return new Map(Object.entries(saved));
  } catch {}
  return fresh();
}
function fresh() {
  const m = new Map();
  for (const n of CANDIDATES) m.set(n, 'picker');
  for (const n of DATA.ambient) m.set(n, 'ambient');
  return m;
}
function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(Object.fromEntries(state)));
}
function stateOf(n) { return state.get(n) ?? 'cut'; }

const CYCLE = ['cut', 'picker', 'ambient'];
function cycle(n, back) {
  const i = CYCLE.indexOf(stateOf(n));
  const next = CYCLE[(i + (back ? 2 : 1)) % 3];
  if (next === 'cut') state.delete(n); else state.set(n, next);
  save();
  render();
}

function svg(icon) {
  const kids = icon.node.map(([tag, attrs]) => {
    const a = Object.entries(attrs)
      .filter(([k]) => k !== 'key')
      .map(([k, v]) => k + '="' + String(v).replace(/"/g, '&quot;') + '"')
      .join(' ');
    return '<' + tag + ' ' + a + '/>';
  }).join('');
  return '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + kids + '</svg>';
}

function cell(name) {
  const icon = BY_NAME.get(name);
  if (!icon) return '';
  const st = stateOf(name);
  return '<div class="cell" data-state="' + st + '" data-name="' + name + '" title="' + name + ' (' + icon.kebab + ')">'
    + (LIVE.has(name) ? '<span class="used">LIVE</span>' : '')
    + (st === 'ambient' ? '<span class="tag">amb</span>' : '')
    + svg(icon)
    + '<span class="nm">' + name + '</span>'
    + '</div>';
}

function render() {
  const q = document.getElementById('q').value.trim().toLowerCase();

  document.getElementById('sections').innerHTML = DATA.groups.map(g => {
    const shown = g.icons.filter(n => !q || n.toLowerCase().includes(q) || (BY_NAME.get(n)?.kebab ?? '').includes(q));
    if (!shown.length) return '';
    const kept = g.icons.filter(n => stateOf(n) !== 'cut').length;
    return '<section>'
      + '<div class="sec-head"><h2>' + g.label + '</h2>'
      + '<span class="n">' + kept + '/' + g.icons.length + ' kept</span>'
      + '<span class="acts">'
      + '<button data-group="' + g.id + '" data-act="all">keep all</button>'
      + '<button data-group="' + g.id + '" data-act="none">cut all</button>'
      + '</span></div>'
      + (g.note ? '<p class="note">' + g.note + '</p>' : '')
      + '<div class="grid">' + shown.map(cell).join('') + '</div>'
      + '</section>';
  }).join('');

  // Anything kept that isn't in a curated group — added via search. Always visible,
  // otherwise it silently lands in the export once the search box is cleared.
  const added = [...state.keys()].filter(n => !CANDIDATES.includes(n)).sort();
  document.getElementById('added').innerHTML = added.length
    ? '<section><div class="sec-head"><h2>Kept, not yet in a group</h2>'
      + '<span class="n">' + added.length + ' &mdash; paste these into candidates.mjs</span></div>'
      + '<div class="grid">' + added.map(cell).join('') + '</div></section>'
    : '';

  const res = document.getElementById('results');
  if (q.length >= 2) {
    const extra = DATA.icons
      .map(([n]) => n)
      .filter(n => !CANDIDATES.includes(n))
      .filter(n => n.toLowerCase().includes(q) || (BY_NAME.get(n)?.kebab ?? '').includes(q))
      .slice(0, 120);
    res.innerHTML = '<section><div class="sec-head"><h2>Add from full lucide</h2>'
      + '<span class="n">' + extra.length + ' match' + (extra.length === 1 ? '' : 'es') + (extra.length === 120 ? ' (capped)' : '') + '</span></div>'
      + (extra.length ? '<div class="grid">' + extra.map(cell).join('') + '</div>' : '<p class="empty">No non-candidate icons match.</p>')
      + '</section>';
  } else {
    res.innerHTML = '';
  }

  const vals = [...state.values()];
  document.getElementById('c-picker').textContent = vals.length;
  document.getElementById('c-ambient').textContent = vals.filter(v => v === 'ambient').length;
  document.getElementById('c-cut').textContent = CANDIDATES.filter(n => stateOf(n) === 'cut').length;
}

document.addEventListener('click', (e) => {
  const c = e.target.closest('.cell');
  if (c) { cycle(c.dataset.name, e.altKey); return; }
  const b = e.target.closest('button[data-group]');
  if (b) {
    const g = DATA.groups.find(x => x.id === b.dataset.group);
    for (const n of g.icons) {
      if (b.dataset.act === 'all') { if (stateOf(n) === 'cut') state.set(n, 'picker'); }
      else state.delete(n);
    }
    save(); render();
  }
});
document.getElementById('q').addEventListener('input', render);
document.getElementById('reset').addEventListener('click', () => {
  state = fresh(); save(); render();
});

document.getElementById('export').addEventListener('click', () => {
  const picker = [...state.keys()].sort();
  const ambient = [...state.entries()].filter(([, v]) => v === 'ambient').map(([k]) => k).sort();
  const droppedLive = DATA.currentInUse.filter(n => stateOf(n) === 'cut');

  const registry = 'import {\\n'
    + picker.map(n => '  ' + n + ',').join('\\n')
    + '\\n} from \\'lucide-react\\'\\n\\n'
    + 'export const ICONS = {\\n'
    + picker.map(n => '  ' + n + ',').join('\\n')
    + '\\n} as const\\n\\n'
    + 'export type IconName = keyof typeof ICONS\\n\\n'
    + 'export const ICON_NAMES = Object.keys(ICONS) as IconName[]\\n\\n'
    + 'export const AMBIENT_ICON_NAMES = [\\n'
    + ambient.map(n => '  \\'' + n + '\\',').join('\\n')
    + '\\n] as const satisfies readonly IconName[]\\n';

  const legacyByExport = Object.fromEntries(Object.entries(DATA.renameMap).map(([k, v]) => [v, k]));
  const purgeLines = [
    ...DATA.pendingPurge.map(v => "  '" + v + "', // no replacement"),
    ...droppedLive.map(n => "  '" + legacyByExport[n] + "', // was going to be " + n + ", now cut"),
  ];
  const purge = purgeLines.length ? purgeLines.join('\\n') : '  // nothing to purge';

  const body = document.getElementById('dlg-body');
  body.innerHTML = ''
    + '<h4>Counts</h4><pre>picker: ' + picker.length + '\\nambient: ' + ambient.length + '\\ncut from candidates: ' + CANDIDATES.filter(n => stateOf(n) === 'cut').length + '</pre>'
    + '<h4>src/lib/icons.ts</h4>' + block(registry)
    + '<h4>Live values that need purging in the migration</h4>' + block('const DROPPED_LEGACY_VALUES = [\\n' + purge + '\\n]')
    + '<h4>Rename map (old kebab value &rarr; new export name)</h4>' + block(renameMap(picker));
  document.getElementById('dlg').showModal();
});

function renameMap(picker) {
  const lines = Object.entries(DATA.renameMap)
    .filter(([, next]) => picker.includes(next))
    .map(([old, next]) => "  '" + old + "': '" + next + "',");
  return '{\\n' + lines.join('\\n') + '\\n}';
}

function block(text) {
  const id = 'b' + Math.random().toString(36).slice(2, 8);
  return '<pre id="' + id + '">' + text.replace(/</g, '&lt;') + '</pre>'
    + '<div class="row"><button onclick="copy(\\'' + id + '\\', this)">Copy</button></div>';
}
function copy(id, btn) {
  navigator.clipboard.writeText(document.getElementById(id).textContent);
  btn.textContent = 'Copied';
  setTimeout(() => { btn.textContent = 'Copy'; }, 1200);
}

render();
</script>
</body>
</html>
`

await writeFile(path.join(dir, 'index.html'), html, 'utf8')
console.log('wrote index.html')
