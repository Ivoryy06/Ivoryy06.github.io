/* ==========================================================================
   add-work.mjs — put a photo, video or school project into work.js

   Run it from this folder:

     node add-work.mjs photo  pictures/valerie/bird.jpg   "a sparrow, slow sunday"
     node add-work.mjs video  videos/friday.mp4           "friday practice"
     node add-work.mjs school pictures/valerie/poster.jpg "our class poster"

   Then commit and push as usual so the site picks it up.
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';

const here = import.meta.dirname;
const dataFile = path.join(here, 'work.js');
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)$/i;
const CATEGORIES = ['photo', 'video', 'school'];

const [category, file, caption = ''] = process.argv.slice(2);

if (!category || !file) {
  console.log('Usage: node add-work.mjs <photo|video|school> <file> "<caption>"');
  process.exit(1);
}

const kind = category.toLowerCase();
if (!CATEGORIES.includes(kind)) {
  console.log(`"${category}" is not one of: ${CATEGORIES.join(', ')}`);
  process.exit(1);
}

const fullPath = path.resolve(process.cwd(), file);
if (!fs.existsSync(fullPath)) {
  console.log(`Can't find ${file} — check the path and try again.`);
  process.exit(1);
}

const isVideo = VIDEO_EXT.test(file);
if (kind === 'video' && !isVideo) {
  console.log(`${file} doesn't look like a video (use .mp4, .webm or .mov).`);
  process.exit(1);
}
if (kind === 'photo' && isVideo) {
  console.log(`${file} is a video — use the video or school command for it.`);
  process.exit(1);
}

// A school project is still a photo or a video, so it goes under those too.
const tags =
  kind === 'school'
    ? isVideo ? ['video', 'school'] : ['photo', 'school']
    : [kind];

// Work.js is plain JavaScript, so pull the list out and put it back with JSON.
const source = fs.readFileSync(dataFile, 'utf8');
const dataStart = source.indexOf('var WORK =');
const header = source.slice(0, dataStart);
const list = JSON.parse(source.slice(dataStart + 'var WORK ='.length).replace(/;\s*$/, '').trim());

// Keep the path relative to this folder, which is how the page loads it.
const relative = path.relative(here, fullPath).split(path.sep).join('/');
if (relative.startsWith('..')) {
  console.log(`Heads up: ${file} is outside this folder, so the site won't find it.`);
}

const words = path.basename(file, path.extname(file)).replace(/[-_]+/g, ' ').trim();
list.push({
  src: relative,
  alt: caption.trim() || (isVideo ? 'A short video.' : `Photo: ${words}.`),
  ...(caption.trim() ? { caption: caption.trim() } : {}),
  tags
});

// Keep short lists like "tags": ["photo", "school"] on one line.
const body = JSON.stringify(list, null, 2).replace(/"tags": \[\s*([^\]]*)\]/g, function (all, inner) {
  var items = inner.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  return '"tags": [' + items.join(', ') + ']';
});
fs.writeFileSync(dataFile, `${header}var WORK = ${body};\n`);

console.log(`Added ${relative} under: ${tags.join(', ')}`);
console.log('Now commit and push work.js (and the file itself) so it shows up on the site.');
