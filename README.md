# ivy06.me

Valerie's portfolio, served at the root of https://ivy06.me/. One page, plain HTML, CSS and JavaScript, with no build step. The diary stays at https://ivy06.me/diary/ and the tools page at https://ivy06.me/tools/.

## Files

```
index.html    the whole page
style.css     layout and colours (pink + purple, light and dark)
script.js     work gallery, project cards, photo viewer, menu highlight, fade-ins
work.js       the list of photos, videos and school projects
projects.js   the list of websites and tools
add-work.mjs  adds one line to work.js for you
404.html      not-found page
favicon.svg   the little tab icon (shared with the tools and 404 pages)
tools/        the Tools page
```

The page is two portfolios in one: Work is the photo and video side, Projects is the code side (`projects.js`, each entry with a name, one line, the tech and a link).

`pictures/valerie/pfp.jpeg` is the profile picture and `sparrow.jpg` is the photo in the intro.

## Adding work

Open a terminal in this folder, put the file somewhere inside the folder (for example `pictures/valerie/`), then run one of these:

```
node add-work.mjs photo  pictures/valerie/bird.jpg   "a sparrow, slow sunday"
node add-work.mjs video  videos/friday.mp4           "friday practice"
node add-work.mjs school pictures/valerie/poster.jpg "our class poster"
```

The last part in quotes is the little handwriting caption, and you can leave it off. Afterwards commit and push, so `work.js` and the new file go up together:

```
git add -A
git commit -m "Add a new photo"
git push
```

A school project that is a video gets tagged as both `video` and `school`, so it shows up under both filter buttons. If you would rather edit by hand, `work.js` is just a list — one `{ ... }` per item, with `tags` naming the filters.

While the list is empty, the Work section shows the Instagram feed instead and the filters stay hidden.

## Adding projects

`projects.js` is a plain list too. Copy a block, change the four values, done:

```js
{
  "name": "Diary",
  "desc": "One line about what it is.",
  "tech": "Vanilla JS · Supabase",
  "href": "https://ivy06.me/diary/"
}
```

The cards open in a new tab, and the "More on GitHub" button points at `https://github.com/Ivoryy06`.

## Light and dark

The page opens on whatever the computer's own light/dark setting is (set in a tiny script in the head of `index.html`). The sun/moon button in the profile card switches it, and that choice is remembered in `localStorage` under `vs-theme`. If nobody has picked a side, the page keeps following the system when it changes.

The colour values live at the top of `style.css`: the plain `:root` block is the dark version, and `:root[data-theme="light"]` is the light one.

## Editing

- **Text:** edit `index.html` directly (intro, about, what I do, contact).
- **Work:** see "Adding work" above. The filter buttons read the `tags` in `work.js`.
- **Diary link:** the profile card and the footer both point to `https://ivy06.me/diary/`.
- **Menu highlight:** the side menu highlights whichever section you are reading. It uses the `data-nav` values on the links, so keep those matching the section ids.

## Running locally

Open `index.html` in a browser, or serve the folder: `python -m http.server`.

The old page that lived at `/portofolio/` now redirects here.
