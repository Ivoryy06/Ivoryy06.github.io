/* ==========================================================================
   The Work section: every photo, video and school project lives here.
   You do not have to edit this by hand — open a terminal in this folder and run
   one of these lines instead:

     node add-work.mjs photo  pictures/valerie/bird.jpg  "a sparrow, slow sunday"
     node add-work.mjs video  videos/friday.mp4          "friday practice"
     node add-work.mjs school pictures/valerie/poster.jpg "our class poster"

   Each entry:
     src      path to the file, relative to this folder
     alt      what the picture shows (read out by screen readers)
     caption  the little handwriting line under it, can be left out
     tags     which filter buttons it shows under: photo, video, school
   ========================================================================== */
var WORK = [
  {
    "src": "pictures/valerie/sparrow.jpg",
    "alt": "A sparrow resting on a concrete ledge.",
    "caption": "a sparrow, slow sunday",
    "tags": ["photo"]
  }
];
