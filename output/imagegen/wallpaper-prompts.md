# PS laptop wallpaper edits

Mode: built-in image generation, precise-object-edit.

Inputs: the existing `home-desktop-dark.webp` and `home-desktop-light.webp` wallpapers, plus `public/ps-logo.png` as the exact monogram reference.

Initial direction: preserve the full landscape composition, room, desk, laptop, mountains, lake, clouds, and existing day/night lighting. Replace only the Apple emblem on the laptop lid with the supplied silver/black/cyan PS monogram, matched to the lid perspective. No added objects, text, or interface.

Final refinement prompt, applied separately to both generated theme variants:

Use case: precise-object-edit. Edit the supplied wallpaper with ONE targeted change: reduce the PS emblem on the back of the laptop lid to 40 percent of its current width and height, keeping its current center fixed on the laptop lid. It should be a SMALL subtle manufacturer-size badge, approximately the original small Apple logo size, only about one tenth of laptop lid width. Preserve the exact angular PS monogram shape and silver/cyan materials. Reconstruct the freed surrounding laptop lid as seamless matching matte dark metal. Preserve EVERYTHING ELSE unchanged, same full 1672x941 landscape composition, exact room, furniture, laptop geometry, camera viewpoint, mountains, lake, sky, clouds, and lighting. No cropping, no zooming, no extra text or objects. Output one complete landscape wallpaper.

Final assets: `public/backgrounds/home-desktop-ps-dark.webp` and `public/backgrounds/home-desktop-ps-light.webp`.
