FIYOTA / TIMEORA — square (1:1) product image sets
==================================================
Every image is 1080x1080 (master PNG) with 640x640 web copies in WebP + JPG.

  fiyota-ivory/     ... silver "Ivory Tank"      (folders: timora-lumiere)
  fiyota-gold/      ... all-gold "Champagne Gold"
  fiyota-two-tone/  ... gold case + gold centre row, silver outer rows
  fiyota-crystal-gold/ ... round gold case, crystal markers, 5-row soft links
  fiyota-crystal-two-tone/ ... same round case, bracelet gold centre + silver outer rows
  fiyota-pearl-tank/ ... slim silver tank, pearl dial, 5-row fine links
  fiyota-pearl-two-tone/ ... same tank, gold hands/indices/crown + gold centre links
  fiyota-noir-two-tone/ ... same tank in black dial, gold details, two-tone links

Each folder has, per shot (main / wrist / detail):
  NAME-MAIN.png      full-quality master, carries the Bangla "বাটারফ্লাই লক" caption
  NAME-WRIST.png     no caption
  NAME-DETAIL.png    no caption
  and the web exports  <slug>-<shot>-1080.webp|jpg  and  -640.webp|jpg

Web usage:
  <picture>
    <source srcset="/watches/<slug>/<slug>-main-1080.webp" type="image/webp" />
    <img src="/watches/<slug>/<slug>-main-1080.jpg" width="1080" height="1080"
         alt="..." loading="lazy" />
  </picture>
