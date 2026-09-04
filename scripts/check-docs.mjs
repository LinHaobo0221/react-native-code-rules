import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const locales = ['zh-CN', 'en', 'ja'];
const chapters = [
  '01-core-principles.md',
  '02-project-structure.md',
  '03-routing-and-navigation.md',
  '04-component-and-styling.md',
  '05-figma-workflow.md',
  '06-interaction-platform-and-accessibility.md',
  '07-delivery-and-constraints.md',
  '08-performance-and-rendering.md',
  '09-testing-strategy.md',
  '10-security-and-privacy.md',
  '11-project-specific-rules.md',
  '12-final-checklist.md',
];
const documents = ['00-core-rules.md', ...chapters, 'README.md'];
const sources = [
  ['docs/react-native-codex-execution-rules.md', 'ffb4fa67cea70f25065e7cc99c73a5c1f90efeda5adcb9aec7fe47139cd7c477'],
  ['docs/react-native-engineering-standards.md', '7b7137b8467a22bac09d25460f9f2cc6c5b938e9804db728d52ff303bc3e8516'],
];

// These hashes pin the user's v2.0 source snapshots, not the previous Git revision.
for (const [path, hash] of sources) {
  assert.equal(createHash('sha256').update(readFileSync(join(root, path))).digest('hex'), hash, `${path}: source snapshot changed`);
}

const core = read(sources[0][0]);
const standard = read(sources[1][0]);
const sections = [...standard.matchAll(/^## (\d+)\. .+$/gm)];
assert.deepEqual(sections.map((match) => Number(match[1])), Array.from({ length: 13 }, (_, i) => i + 1));
const coreBody = (text) => text.slice(text.indexOf('## 1. ')).trimEnd();
assert.equal(coreBody(read('docs/zh-CN/00-core-rules.md')), coreBody(core), 'Core sections 1–6 must remain verbatim');

// Only the documented navigation adaptations are allowed in Chinese rule bodies.
for (let i = 0; i < chapters.length; i += 1) {
  let expected = standard.slice(sections[i].index, i === 11 ? standard.length : sections[i + 1].index).trimEnd();
  expected = expected.replace(/^## /, '# ');
  if (i === 0) {
    expected = expected
      .replace('`docs/codex/react-native-codex-execution-rules.md`', '[00-core-rules.md](00-core-rules.md)')
      .replace('本文件中由根目录 `AGENTS.md`', '完整工程标准分册中由根目录 `AGENTS.md`')
      .replace('如果本文件与更具体的项目级规则不一致', '如果本共通规约与更具体的项目级规则不一致');
  }
  assert.equal(read(`docs/zh-CN/${chapters[i]}`).trimEnd(), expected, `${chapters[i]}: Chinese source coverage mismatch`);
}
console.log('PASS: original source hashes; core sections 1–6; engineering sections 1–13, including every checklist and example');

function markdown(text, path) {
  const structure = [];
  const code = [];
  const outside = [];
  let fence = null;
  let body = [];
  let inParagraph = false;
  for (const line of text.split('\n')) {
    const marker = line.match(/^\s*(`{3,}|~{3,})([^\s]*)\s*$/);
    if (fence) {
      if (marker && marker[1][0] === fence.char && marker[1].length >= fence.length && marker[2] === '') {
        code.push({ language: fence.language, body: body.join('\n') });
        fence = null;
      } else {
        body.push(line);
      }
      continue;
    }
    if (marker) {
      fence = { char: marker[1][0], length: marker[1].length, language: marker[2] };
      body = [];
      structure.push(`fence:${marker[2]}`);
      inParagraph = false;
      continue;
    }
    outside.push(line);
    const heading = line.match(/^(#{1,6})\s+(?:(\d+(?:\.\d+)*)\.?\s+)?/);
    const item = line.match(/^(\s*)(?:([-*+])|(\d+)\.)\s+(\[[ xX]\]\s+)?/);
    if (heading) structure.push(`heading:${heading[1].length}:${heading[2] ?? ''}`);
    else if (item) structure.push(`item:${item[1].length}:${item[3] ?? '-'}:${item[4] ? 'checkbox' : ''}`);
    else if (/^\|/.test(line)) structure.push(`table:${line.split('|').length}`);
    else if (/^>/.test(line)) structure.push('quote');
    else if (/^---\s*$/.test(line)) structure.push('separator');
    else if (line.trim()) {
      if (!inParagraph) structure.push('paragraph');
      inParagraph = true;
      continue;
    }
    inParagraph = false;
  }
  assert.equal(fence, null, `${path}: unclosed Markdown fence`);
  return { structure, code, outside: outside.join('\n') };
}

const normalizeLocale = (text) => text
  .replaceAll('rules_language: zh-CN', 'rules_language: LOCALE')
  .replaceAll('rules_language: en', 'rules_language: LOCALE')
  .replaceAll('rules_language: ja', 'rules_language: LOCALE');
const normalizeLink = (text) => text
  .replace(/\/(?:zh-CN|en|ja)\//g, '/LOCALE/')
  .replace(/AGENTS\.(?:zh-CN|en|ja)\.md/g, 'AGENTS.LOCALE.md');
const linkTargets = (parsed) => [...parsed.outside.matchAll(/\]\(([^\s)]+)\)/g)].map((match) => normalizeLink(match[1]));
const inlineCode = (parsed) => [...parsed.outside.matchAll(/`([^`\n]+)`/g)]
  .map((match) => normalizeLink(normalizeLocale(match[1])))
  .sort();
function checkLinkLocale(parsed, locale, path) {
  for (const match of parsed.outside.matchAll(/\]\(([^\s)]+)\)/g)) {
    const languages = [
      ...match[1].matchAll(/(?:^|\/)(zh-CN|en|ja)\//g),
      ...match[1].matchAll(/AGENTS\.(zh-CN|en|ja)\.md/g),
    ];
    for (const language of languages) {
      assert.equal(language[1], locale, `${path}: execution link points to another locale: ${match[1]}`);
    }
  }
}
const executableExamples = (parsed) => parsed.code
  .filter(({ language }) => language !== 'text')
  .map(({ language, body }) => ({ language, body: normalizeLocale(body) }));

for (const locale of locales) {
  assert.deepEqual(readdirSync(join(root, 'docs', locale)).filter((name) => name.endsWith('.md')).sort(), [...documents].sort(), `${locale}: unexpected or missing chapters`);
  for (const file of documents) {
    const baselinePath = `docs/zh-CN/${file}`;
    const path = `docs/${locale}/${file}`;
    const baseline = markdown(read(baselinePath), baselinePath);
    const translated = markdown(read(path), path);
    checkLinkLocale(translated, locale, path);
    assert.deepEqual(translated.structure, baseline.structure, `${path}: paragraphs, headings, lists, tables, checkboxes, or code blocks differ`);
    assert.deepEqual(executableExamples(translated), executableExamples(baseline), `${path}: executable examples differ`);
    assert.deepEqual(linkTargets(translated), linkTargets(baseline), `${path}: chapter links or locale routing differ`);
    if (file !== 'README.md') {
      const content = file === '00-core-rules.md' ? coreBody(read(path)) : read(path);
      const sourceContent = file === '00-core-rules.md' ? coreBody(read(baselinePath)) : read(baselinePath);
      assert.deepEqual(inlineCode(markdown(content, path)), inlineCode(markdown(sourceContent, baselinePath)), `${path}: inline code identifiers differ`);
    }
  }
  const entryPath = `AGENTS.${locale}.md`;
  assert.match(read(entryPath), new RegExp(`^rules_language: ${locale}$`, 'm'), `${entryPath}: wrong rules language`);
  checkLinkLocale(markdown(read(entryPath), entryPath), locale, entryPath);
  assert.deepEqual(markdown(read(entryPath), entryPath).structure, markdown(read('AGENTS.zh-CN.md'), 'AGENTS.zh-CN.md').structure, `${entryPath}: execution-gate structure differs`);
  assert.deepEqual(linkTargets(markdown(read(entryPath), entryPath)), linkTargets(markdown(read('AGENTS.zh-CN.md'), 'AGENTS.zh-CN.md')), `${entryPath}: reading routes differ`);
  const templatePath = `templates/${locale}/app-specific.md`;
  const template = read(templatePath);
  assert.deepEqual([...template.matchAll(/^## (\d+)\. /gm)].map((match) => Number(match[1])), Array.from({ length: 22 }, (_, i) => i + 1), `${templatePath}: must cover all 22 project facts`);
  assert.deepEqual(markdown(template, templatePath).structure, markdown(read('templates/zh-CN/app-specific.md'), 'Chinese template').structure, `${templatePath}: field structure differs`);
}
assert.equal(read('AGENTS.md'), read('AGENTS.zh-CN.md'), 'Root and Chinese execution entries must match exactly');
console.log('PASS: three locales have matching paragraphs, chapters, gates, templates, checklists, tables, code, and reading routes');

function markdownFiles(directory) {
  return readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith('.md') ? [path] : [];
  });
}
const paths = [
  ...readdirSync(root).filter((name) => name.endsWith('.md')),
  ...markdownFiles('docs'),
  ...markdownFiles('templates'),
];
let linkCount = 0;
for (const path of paths) {
  const text = read(path);
  assert.ok(text.endsWith('\n'), `${path}: missing final newline`);
  const parsed = markdown(text, path);
  for (const match of parsed.outside.matchAll(/\]\(([^\s)]+)\)/g)) {
    const href = match[1];
    if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('#')) continue;
    const target = decodeURIComponent(href.split('#')[0]);
    assert.ok(existsSync(resolve(root, dirname(path), target)), `${path}: broken relative link ${href}`);
    linkCount += 1;
  }
}
console.log(`PASS: ${paths.length} Markdown files; ${linkCount} relative file links resolve; all code fences are closed`);
console.log('NOTE: structural equivalence does not prove translation semantics; review translations against the source.');
